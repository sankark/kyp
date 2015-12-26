package store

import (
	"github.com/kyp"
	"golang.org/x/net/context"
	"golang.org/x/oauth2/google"
	"google.golang.org/cloud"
	"google.golang.org/cloud/storage"
	"io/ioutil"
	"log"
)

var STORAGE_CLIENT *storage.Client

func init() {

	if STORAGE_CLIENT == nil {
		jsonKey, err := ioutil.ReadFile(kyp.GetProp("secrets"))
		if err != nil {
			log.Fatal(err)
		}
		conf, err := google.JWTConfigFromJSON(
			jsonKey,
			storage.ScopeFullControl,
		)
		if err != nil {
			log.Fatal(err)
		}
		ctx := context.Background()
		client, err := storage.NewClient(ctx, cloud.WithTokenSource(conf.TokenSource(ctx)))
		if err != nil {
			log.Fatal(err)
		}
		STORAGE_CLIENT = client

	}
}
