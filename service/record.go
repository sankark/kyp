package service

import (
	"reflect"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/mjibson/goon"
	"golang.org/x/net/context"
	"google.golang.org/appengine"
	"google.golang.org/appengine/datastore"
)

var STATUS_SUCCESS = "success"
var STATUS_ERROR = "error"

type Response struct {
	St_Msg  string
	St_Code int
	Err_msg string
	Data    interface{}
}

type Connection struct {
	Goon    *goon.Goon
	Context context.Context
}

func Kind(e interface{}) string {
	typ := reflect.TypeOf(e).String()
	ps := strings.Split(typ, ".")
	return ps[len(ps)-1]
}

func New(c context.Context) *Connection {
	r := c.(*gin.Context).Request
	aecontext := appengine.NewContext(r)
	return &Connection{Goon: goon.FromContext(aecontext),
		Context: aecontext}
}
func FromContext(c context.Context) *Connection {
	return &Connection{Goon: goon.FromContext(c)}
}

func (ds *Connection) DatastoreKeyWithKind(kind string, id int64) *datastore.Key {
	return datastore.NewKey(ds.Context, kind, "", id, nil)
}

func (ds *Connection) DatastoreKeyWithId(record interface{}, id int64) *datastore.Key {
	return datastore.NewKey(ds.Context, Kind(record), "", id, nil)
}

func (ds *Connection) Add(record interface{}) Response {
	resp := Response{St_Msg: STATUS_SUCCESS, St_Code: 200}
	k, err := ds.Goon.Put(record)
	if err != nil {
		resp.Err_msg = err.(error).Error()
		resp.St_Code = 500
		resp.St_Msg = STATUS_ERROR
	}
	resp.Data = k
	return resp
}

func (ds *Connection) PropListPut(record interface{}, key *datastore.Key) *datastore.Key {
	k, _ := datastore.Put(ds.Context, key, record)
	return k
}

func (ds *Connection) PropListDelete(key *datastore.Key) error {
	return datastore.Delete(ds.Context, key)
}

func (ds *Connection) PropListGet(record interface{}, key *datastore.Key) Response {
	resp := Response{St_Msg: STATUS_SUCCESS, St_Code: 200}
	err := datastore.Get(ds.Context, key, record)
	if err != nil {
		resp.Err_msg = err.(error).Error()
		resp.St_Code = 500
		resp.St_Msg = STATUS_ERROR
	}
	resp.Data = record
	return resp
}

func (ds *Connection) List(record interface{}) Response {
	resp := Response{St_Msg: STATUS_SUCCESS, St_Code: 200}
	kind := Kind(record)
	_, err := ds.Goon.GetAll(datastore.NewQuery(kind), record)
	if err != nil {
		resp.Err_msg = err.(error).Error()
		resp.St_Code = 500
		resp.St_Msg = STATUS_ERROR
	}
	resp.Data = record
	return resp
}

func (ds *Connection) GetMulti(record []interface{}) Response {
	resp := Response{St_Msg: STATUS_SUCCESS, St_Code: 200}
	err := ds.Goon.GetMulti(record)
	if err != nil {
		resp.Err_msg = err.(error).Error()
		resp.St_Code = 500
		resp.St_Msg = STATUS_ERROR
	}
	resp.Data = record
	return resp
}

func (ds *Connection) Get(record interface{}) Response {
	resp := Response{St_Msg: STATUS_SUCCESS, St_Code: 200}
	err := ds.Goon.Get(record)
	if err != nil {
		resp.Err_msg = err.(error).Error()
		resp.St_Code = 500
		resp.St_Msg = STATUS_ERROR
	}
	resp.Data = record
	return resp
}

func (ds *Connection) ListKeys(record interface{}) Response {
	resp := Response{St_Msg: STATUS_SUCCESS, St_Code: 200}
	kind := Kind(record)
	keys, err := ds.Goon.GetAll(datastore.NewQuery(kind).KeysOnly(), nil)
	if err != nil {
		resp.Err_msg = err.(error).Error()
		resp.St_Code = 500
		resp.St_Msg = STATUS_ERROR + kind
	}
	resp.Data = keys
	return resp
}

func (ds *Connection) Remove(key interface{}) Response {
	resp := Response{St_Msg: STATUS_SUCCESS, St_Code: 200}
	err := ds.Goon.Delete(key.(*datastore.Key))
	if err != nil {
		resp.Err_msg = err.(error).Error()
		resp.St_Code = 500
		resp.St_Msg = STATUS_ERROR
	}
	resp.Data = key
	return resp
}
