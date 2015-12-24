package models

import (
	"fmt"
	"github.com/kyp/store"
	"golang.org/x/net/context"
	"google.golang.org/cloud/datastore"
	"log"
	"net/http"
)

type Record struct {
	ID   int64  `form:"id" binding:"required"`
	Name string `form:"name" binding:"required"`
}

// BookDatabase provides thread-safe access to a database of books.
type RecordStore interface {
	ListRecords() ([]*Record, error)

	GetRecord(id int64) (*Record, error)

	GetRecordByName(name string) ([]*Record, error)

	AddRecord(b *Record) (int64, error)

	DeleteRecord(id int64) (int64, error)

	UpdateRecord(b *Record) (*Record, error)

	Close()
}

type recordDB struct {
	client *datastore.Client
}

// Ensure datastoreDB conforms to the RecordStore interface.
var _ RecordStore = &recordDB{}

var RS RecordStore

func User(ds_req func(RecordStore) (interface{}, interface{}), r *http.Request) (interface{}, interface{}) {
	GetRecordDS(r)
	return ds_req(RS)
}

func GetRecordDS(r *http.Request) RecordStore {
	return newDatastoreDB(r)
}
func newDatastoreDB(r *http.Request) RecordStore {
	if RS == nil {
		log.Print("initialized")
		client, _ := store.GetClient(r)
		RS = &recordDB{
			client: client,
		}

	}
	return RS
}

// Close closes the database.
func (db *recordDB) Close() {
	// No op.
}

func (db *recordDB) datastoreKey(id int64) *datastore.Key {
	ctx := context.Background()
	return datastore.NewKey(ctx, "Record", "", id, nil)
}

func (db *recordDB) GetRecord(id int64) (*Record, error) {
	ctx := context.Background()
	k := db.datastoreKey(id)
	record := &Record{}
	if err := db.client.Get(ctx, k, record); err != nil {
		return nil, fmt.Errorf("datastoredb: could not get Record: %v", err)
	}
	record.ID = id
	return record, nil
}

func (db *recordDB) AddRecord(b *Record) (int64, error) {
	ctx := context.Background()
	//NewIncompleteKey
	k := datastore.NewKey(ctx, "Record", "", b.ID, nil)
	k, err := db.client.Put(ctx, k, b)
	if err != nil {
		return 0, fmt.Errorf("datastoredb: could not put Record: %v", err)
	}
	return k.ID(), nil
}

func (db *recordDB) DeleteRecord(id int64) (int64, error) {
	ctx := context.Background()
	k := db.datastoreKey(id)
	if err := db.client.Delete(ctx, k); err != nil {
		return id, fmt.Errorf("datastoredb: could not delete Record: %v", err)
	}
	return id, nil
}

func (db *recordDB) UpdateRecord(b *Record) (*Record, error) {
	ctx := context.Background()
	k := db.datastoreKey(b.ID)
	if _, err := db.client.Put(ctx, k, b); err != nil {
		return b, fmt.Errorf("datastoredb: could not update Record: %v", err)
	}
	return b, nil
}

func (db *recordDB) ListRecords() ([]*Record, error) {
	ctx := context.Background()
	records := make([]*Record, 0)
	q := datastore.NewQuery("Record").
		Order("Name")

	keys, err := db.client.GetAll(ctx, q, &records)

	if err != nil {
		return nil, fmt.Errorf("datastoredb: could not list records: %v", err)
	}

	for i, k := range keys {
		records[i].ID = k.ID()
	}

	return records, nil
}

func (db *recordDB) GetRecordByName(name string) ([]*Record, error) {
	ctx := context.Background()
	if name == "" {
		return db.ListRecords()
	}

	records := make([]*Record, 0)
	q := datastore.NewQuery("Record").
		Filter("CreatedByID =", name).
		Order("Title")

	keys, err := db.client.GetAll(ctx, q, &records)

	if err != nil {
		return nil, fmt.Errorf("datastoredb: could not list records: %v", err)
	}

	for i, k := range keys {
		records[i].ID = k.ID()
	}

	return records, nil
}
