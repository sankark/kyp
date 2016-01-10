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
	Id       int64          `json:"id" binding:"required" datastore:"-" goon:"id"`
	Parent   *datastore.Key `datastore:"-" goon:"parent"`
	Comments []Comment      `json:"comments"`
}

type ProfileOut struct {
	Id       int64             `json:"id" binding:"required" datastore:"-" goon:"id"`
	Details  map[string]string `json:"details" binding:"required"`
	Comments []Comment         `json:"comments"`
}

type ProfileService interface {
	PutProfile(c *gin.Context)
	DeleteProfile(c *gin.Context)
	GetProfile(c *gin.Context)
	AddComment(c *gin.Context)
	ListProfile(c *gin.Context)
}

var _ ProfileService = &Profile{}

func (profile *Profile) GetProfile(c *gin.Context) {
	conn := New(c)
	id, _ := strconv.ParseInt(c.Param("id"), 10, 64)
	profile.Id = id
	c.BindJSON(&profile)
	fmt.Print(profile)
	resp := conn.Get(profile)
	c.JSON(http.StatusOK, resp)
}

func (profile *Profile) PutProfile(c *gin.Context) {
	conn := New(c)
	p := &ProfileOut{}
	c.BindJSON(p)
	key := conn.DatastoreKeyWithKind("ProfileDetails", 0)
	prop_list := MapToPropertyList(p.Details)
	log.Debugf(conn.Context, fmt.Sprintf("ret %#v", prop_list))
	r := conn.PropListPut(prop_list, key)
	log.Debugf(conn.Context, fmt.Sprintf("%#v", r))
	profile.Id = p.Id
	profile.Parent = r.Data.(*datastore.Key)
	profile.Comments = p.Comments
	log.Debugf(conn.Context, fmt.Sprintf("%#v", profile))
	resp := conn.Add(profile)
	c.JSON(http.StatusOK, resp)
}

func (profile *Profile) DeleteProfile(c *gin.Context) {
	conn := New(c)
	c.BindJSON(&profile)
	key := conn.DatastoreKeyWithId(profile, profile.Id)
	resp := conn.Remove(key)
	c.JSON(http.StatusOK, resp)
}

func (profile *Profile) AddComment(c *gin.Context) {
	profile.Comments = append(profile.Comments, Comment{})
	profile.PutProfile(c)
}

func (profile *Profile) ListProfile(c *gin.Context) {
	conn := New(c)
	resp := conn.List(profile)
	c.JSON(http.StatusOK, resp)
}

func MapToPropertyList(det_map map[string]string) *datastore.PropertyList {
	var ret = make([]datastore.Property, 0)
	for k, v := range det_map {
		ret = append(ret, datastore.Property{
			Name:  k,
			Value: v,
		})
	}
	pl := &datastore.PropertyList{}
	pl.Load(ret)
	return pl
}
