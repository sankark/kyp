package service

import (
	"github.com/gin-gonic/gin"
	"github.com/mjibson/goon"
	"golang.org/x/net/context"
	"google.golang.org/appengine"
	"google.golang.org/appengine/datastore"
	"reflect"
	"strings"
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
	return &Connection{Goon: goon.NewGoon(r),
		Context: appengine.NewContext(r)}
}
func FromContext(c context.Context) *Connection {
	return &Connection{Goon: goon.FromContext(c)}
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
