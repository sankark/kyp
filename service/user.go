package service

import (
	"github.com/gin-gonic/gin"
	models "github.com/kyp/models"
	"log"
	"net/http"
)

var STATUS_SUCCESS = "success"
var STATUS_ERROR = "error"

type Response struct {
	St_Msg  string
	St_Code int
	Err_msg string
	Data    interface{}
}

func AddUser(c *gin.Context) {
	resp := Response{St_Msg: STATUS_SUCCESS, St_Code: 200}
	json := &models.Record{}
	c.BindJSON(json)
	ds_req := func(DS models.RecordStore) (interface{}, interface{}) {
		return DS.AddRecord(json)
	}
	id, err := models.User(ds_req, c.Request)
	if err != nil {
		resp.Err_msg = err.(error).Error()
		resp.St_Code = 500
		resp.St_Msg = STATUS_ERROR
	}
	resp.Data = id
	c.JSON(http.StatusOK, resp)
}

func ListUser(c *gin.Context) {
	ds_req := func(DS models.RecordStore) (interface{}, interface{}) {
		return DS.ListRecords()
	}
	records, _ := models.User(ds_req, c.Request)
	log.Print(records)
	c.JSON(http.StatusOK, records)

}
