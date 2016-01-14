package service

import (
	"fmt"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/kyp/log"
	"github.com/kyp/timestamp"
	"google.golang.org/appengine/datastore"
)

type Timestamp timestamp.Timestamp

type Label struct {
	Name  string
	Value map[string]string
}

type Comment struct {
	Text   string `json:"text"`
	Date   string
	Like   int64
	Unlike int64
}

type Profile struct {
	Id       int64          `datastore:"-" goon:"id"`
	Parent   *datastore.Key `datastore:"-" goon:"parent"`
	Comments []Comment      `json:"comments" datastore:"comments"`
}

type ProfileOut struct {
	Id       int64                  `json:"id" binding:"required" datastore:"-" goon:"id"`
	Details  map[string]interface{} `json:"details" binding:"required"`
	Comments []Comment              `json:"comments"`
}

func GetProfile(c *gin.Context) {
	conn := New(c)
	id, _ := strconv.ParseInt(c.Param("id"), 10, 64)
	profile := &Profile{Id: id, Parent: conn.DatastoreKeyWithKind("ProfileDetails", 4986010354057216)}
	resp := conn.Get(profile)
	c.JSON(http.StatusOK, resp)
}

func PutProfile(c *gin.Context) {
	conn := New(c)

	prof_out := &ProfileOut{}
	c.BindJSON(prof_out)

	det_id := NumberToInt(prof_out.Details["id"])
	det_key := conn.DatastoreKeyWithKind("ProfileDetails", det_id)
	det_list := &datastore.PropertyList{}
	det_list = MapToPropertyList(prof_out.Details)
	det_key = conn.PropListPut(det_list, det_key)
	log.Debugf(conn.Context, fmt.Sprintf("details %#v", det_list))

	prof_in := &Profile{Id: prof_out.Id, Parent: det_key}
	conn.Get(prof_in)
	prof_in.Parent = det_key
	prof_in.Comments = prof_out.Comments
	resp := conn.Add(prof_in)
	log.Debugf(conn.Context, fmt.Sprintf("%#v", prof_in))

	c.JSON(http.StatusOK, resp)
}

func NumberToInt(n interface{}) int64 {
	if n == nil {
		return 0
	}
	return int64(n.(float64))
}

func DeleteProfile(c *gin.Context) {
	conn := New(c)

	prof_id, _ := strconv.ParseInt(c.Param("prof_id"), 10, 64)
	det_id, _ := strconv.ParseInt(c.Param("det_id"), 10, 64)
	det_key := conn.DatastoreKeyWithKind("ProfileDetails", det_id)
	prof_in := &Profile{Id: prof_id, Parent: det_key}

	conn.Get(prof_in)
	log.Debugf(conn.Context, fmt.Sprintf("profiles %#v", prof_in))
	resp := conn.Remove(conn.Goon.Key(prof_in))
	resp = conn.Remove(prof_in.Parent)

	c.JSON(http.StatusOK, resp)
}

func AddComment(c *gin.Context) {
	id, _ := strconv.ParseInt(c.Param("id"), 10, 64)
	profile := &Profile{Id: id}
	profile.Comments = append(profile.Comments, Comment{})
	PutProfile(c)
}

func ListProfile(c *gin.Context) {
	conn := New(c)

	prof_list := make([]Profile, 0)
	out_list := make([]ProfileOut, 0)
	conn.List(&prof_list)

	var prof Profile
	for _, prof = range prof_list {
		var pout_t ProfileOut
		det_list := &datastore.PropertyList{}
		conn.PropListGet(det_list, prof.Parent)
		pout_t.Details = PropertyListToMap(det_list)
		pout_t.Details["id"] = prof.Parent.IntID()
		pout_t.Comments = prof.Comments
		pout_t.Id = prof.Id
		out_list = append(out_list, pout_t)

	}
	c.JSON(http.StatusOK, out_list)
}

func MapToPropertyList(det_map map[string]interface{}) *datastore.PropertyList {
	var ret = make([]datastore.Property, 0)
	for k, v := range det_map {
		/*		if k == "id" {
				v = NumberToInt(det_map[k])
			}*/
		ret = append(ret, datastore.Property{
			Name:  k,
			Value: v,
		})
	}
	pl := &datastore.PropertyList{}
	pl.Load(ret)
	return pl
}

func PropertyListToMap(pl *datastore.PropertyList) map[string]interface{} {
	var ret = make(map[string]interface{}, 0)
	var prop datastore.Property
	li, _ := pl.Save()
	for _, prop = range li {
		ret[prop.Name] = prop.Value
	}

	return ret
}
