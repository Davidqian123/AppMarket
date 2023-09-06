package service

import (
	"errors"
	"fmt"
	"mime/multipart"
	"reflect"

	"appstore/backend"
	"appstore/constants"
	"appstore/gateway/stripe"
	"appstore/model"

	"github.com/olivere/elastic/v7"
)


func SearchApps(title string, description string) ([]model.App, error) {
   if title == "" {
       return SearchAppsByText("description", description)
   }
   if description == "" {
       return SearchAppsByText("title", title)
   }


   query1 := elastic.NewMatchQuery("title", title)
   query1.Operator("AND")
   query2 := elastic.NewMatchQuery("description", description)
   query2.Operator("AND")
   query := elastic.NewBoolQuery().Must(query1, query2)
   searchResult, err := backend.ESBackend.ReadFromES(query, constants.APP_INDEX)
   if err != nil {
       return nil, err
   }


   return getAppFromSearchResult(searchResult), nil
}


func SearchAppsByText(textFieldName string, textFieldValue string) ([]model.App, error) {
   query := elastic.NewMatchQuery(textFieldName, textFieldValue)
   query.Operator("AND")
   if textFieldValue == "" {
       query.ZeroTermsQuery("all")
   }
   searchResult, err := backend.ESBackend.ReadFromES(query, constants.APP_INDEX)
   if err != nil {
       return nil, err
   }

   return getAppFromSearchResult(searchResult), nil
}


func SearchAppsByDescription(description string) ([]model.App, error) {
   query := elastic.NewMatchQuery("description", description)
   query.Operator("AND")
   if description == "" {
       query.ZeroTermsQuery("all")
   }
   searchResult, err := backend.ESBackend.ReadFromES(query, constants.APP_INDEX)
   if err != nil {
       return nil, err
   }


   return getAppFromSearchResult(searchResult), nil
}

func SearchAppByID(appID string) (*model.App, error) {
   query := elastic.NewTermQuery("id", appID)
   searchResult, err := backend.ESBackend.ReadFromES(query, constants.APP_INDEX)
   if err != nil {
       return nil, err
   }
   results := getAppFromSearchResult(searchResult)
   if len(results) == 1 {
       return &results[0], nil
   }
   return nil, nil
}


func getAppFromSearchResult(searchResult *elastic.SearchResult) []model.App {
   var ptype model.App
   var apps []model.App
   for _, item := range searchResult.Each(reflect.TypeOf(ptype)) {
       p := item.(model.App)
       apps = append(apps, p)
   }
   return apps
}

func SaveApp(app *model.App, file multipart.File) error {
    productID, priceID, err := stripe.CreateProductWithPrice(app.Title, app.Description, int64(app.Price*100))
    if err != nil {
        fmt.Printf("Failed to create Product and Price using Stripe SDK %v\n", err)
        return err
    }
    app.ProductID = productID
           app.PriceID = priceID
    fmt.Printf("Product %s with price %s is successfully created", productID, priceID)

    medialink, err := backend.GCSBackend.SaveToGCS(file, app.Id)
    if err != nil {
        return err
    }
    app.Url = medialink

    err = backend.ESBackend.SaveToES(app, constants.APP_INDEX, app.Id)
    if err != nil {
        fmt.Printf("Failed to save app to elastic search with app index %v\n", err)
        return err
    }
    fmt.Println("App is saved successfully to ES app index.")

 
   err = backend.ESBackend.SaveToES(app, constants.APP_INDEX, app.Id)
    if err != nil {
        fmt.Printf("Failed to save app to elastic search with app index %v\n", err)
        return err
    }
    fmt.Println("App is saved successfully to ES app index.")
 
    return nil
 
}


func DeleteApp(id string, user string) error {
    query := elastic.NewBoolQuery()
    query.Must(elastic.NewTermQuery("id", id))
    query.Must(elastic.NewTermQuery("user", user))

    return backend.ESBackend.DeleteFromES(query, constants.APP_INDEX)
}


func CheckoutApp(domain string, appID string) (string, error) {
    app, err := SearchAppByID(appID)
    if err != nil {
        return "", err
    }
    if app == nil {
        return "", errors.New("unable to find app in elasticsearch")
    }
    return stripe.CreateCheckoutSession(domain, app.PriceID)
}
 
 