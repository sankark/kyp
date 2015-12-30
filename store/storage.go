package store

import (
	"google.golang.org/cloud/storage"
)

var STORAGE_CLIENT *storage.Client

func init() {
   	STORAGE_CLIENT  = nil
}
