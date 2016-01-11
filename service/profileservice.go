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
	Id       int64          `datastore:"-" goon:"id" json:"id" binding:"required"`
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
	p_out := new(ProfileOut)
	key := conn.DatastoreKeyWithKind("ProfileDetails", 0)
	c.BindJSON(p_out)
	prop_list := MapToPropertyList(p_out.Details)
	resp := conn.PropListPut(prop_list, key)
	prof := &Profile{Id: p_out.Id}
	conn.Get(prof)
	log.Debugf(conn.Context, fmt.Sprintf("old %#v", prof))
	prof.Parent = resp.Data.(*datastore.Key)
	prof.Comments = p_out.Comments
	resp = conn.Add(prof)
	log.Debugf(conn.Context, fmt.Sprintf("%#v", prof))
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
	prof_list := make([]Profile, 0)
	out_list := make([]ProfileOut, 0)
	conn.List(&prof_list)
	var prof Profile
	for _, prof = range prof_list {
		var pout_t ProfileOut
		plist := conn.PropListGet(prof.Parent).Data.(*datastore.PropertyList)
		pout_t.Details = PropertyListToMap(plist)
		pout_t.Comments = prof.Comments
		pout_t.Id = prof.Id
		out_list = append(out_list, pout_t)

	}
	c.JSON(http.StatusOK, out_list)
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

func PropertyListToMap(pl *datastore.PropertyList) map[string]string {
	var ret = make(map[string]string, 0)
	var prop datastore.Property
	li, _ := pl.Save()
	for _, prop = range li {
		ret[prop.Name] = prop.Value.(string)
	}

	return ret
}
