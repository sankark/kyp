package store

import (
	"github.com/kyp"
	"golang.org/x/oauth2/google"
	"google.golang.org/appengine"
	"google.golang.org/cloud"
	"google.golang.org/cloud/datastore"
	"io/ioutil"
	"log"
	"net/http"
)

var CLIENT *datastore.Client

func GetClient(r *http.Request) (*datastore.Client, error) {

	if CLIENT == nil {
		jsonKey, err := ioutil.ReadFile(kyp.GetProp("secrets"))
		if err != nil {
			log.Fatal(err)
		}
		conf, err := google.JWTConfigFromJSON(
			jsonKey,
			datastore.ScopeDatastore,
			datastore.ScopeUserEmail,
		)
		if err != nil {
			log.Fatal(err)
		}
		ctx := appengine.NewContext(r)
		client, err := datastore.NewClient(ctx, "proj_id", cloud.WithTokenSource(conf.TokenSource(ctx)))
		if err != nil {
			log.Fatal(err)
		}

		CLIENT = client
		if err != nil {
			return nil, err
		}

	}
	return CLIENT, nil
}
