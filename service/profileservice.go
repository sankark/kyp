package service

import (
	"fmt"
	"net/http"
	"strconv"

	"github.com/kyp/auth"

	"github.com/kyp/store"

	"time"

	"github.com/satori/go.uuid"

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
	Prof_Id string `json:"prof_id"`
	Det_Id  string `json:"det_id"`
	Id      string
	Text    string `json:"text"`
	Time    string
	Likes    int64
	Unlikes  int64
}

type Meta struct{
	MValue string `json:"value" datastore:"value"`
	MKey string `json:"key" datastore:"key"`
}

type Profile struct {
	Id       int64          `datastore:"-" goon:"id"`
	Parent   *datastore.Key `datastore:"-" goon:"parent"`
	Consti   string         `json:"consti" datastore:"consti"`
	Comments []Comment      `json:"comments" datastore:"comments"`
	Meta []Meta	`json:"meta" datastore:"meta"`
	Likes    int64 `json:"likes" datastore:"likes"`
	UnLikes    int64 `json:"unlikes" datastore:"unlikes"`
}

type ProfileOut struct {
	Id       int64                  `json:"id" binding:"required" datastore:"-" goon:"id"`
	Details  map[string]interface{} `json:"details" binding:"required"`
	Consti   string                 `json:"consti" datastore:"consti"`
	Comments []Comment              `json:"comments"`
	Meta []Meta	`json:"meta" datastore:"meta"`
	Likes    int64 `json:"likes" datastore:"likes"`
	UnLikes    int64 `json:"unlikes" datastore:"unlikes"`
}

func AddLikes(c *gin.Context){
	status := http.StatusOK
	likes := -1
	authenticated := "false"
	if auth.IsAuthenticated(c) {
		conn := store.New(c)
		prof_id, _ := strconv.ParseInt(c.Param("prof_id"), 10, 64)
		det_id, _ := strconv.ParseInt(c.Param("det_id"), 10, 64)
		det_key := conn.DatastoreKeyWithKind("ProfileDetails", det_id)
		prof_in := &Profile{Id: prof_id, Parent: det_key}
		
		conn.Get(prof_in)
		
		like_type:= c.Query("like_type")
		if like_type == "profile"{
			prof_in.Likes+=1
			likes = prof_in.Likes
		}
		if like_type == "comments"{
			comment_id := c.Query("comment_id")
			for _,c := range prof_in.Comments{
				c.Likes+=1
				likes = c.Likes
			}
		}
		conn.Add(prof_in)
		authenticated = "true"
		status = http.StatusOK
		
	}
	c.JSON(status, gin.H{"authenticated":authenticated, "likes":likes})
	
}

func RevertLikes(c *gin.Context){
	status := http.StatusOK
	unlikes := -1
	authenticated := "false"
	if auth.IsAuthenticated(c) {
		conn := store.New(c)
		prof_id, _ := strconv.ParseInt(c.Param("prof_id"), 10, 64)
		det_id, _ := strconv.ParseInt(c.Param("det_id"), 10, 64)
		det_key := conn.DatastoreKeyWithKind("ProfileDetails", det_id)
		prof_in := &Profile{Id: prof_id, Parent: det_key}
		
		conn.Get(prof_in)
		
		like_type:= c.Query("like_type")
		if like_type == "profile"{
			prof_in.UnLikes-=1
			unlikes = prof_in.UnLikes
		}
		if like_type == "comments"{
			comment_id := c.Query("comment_id")
			for _,c := range prof_in.Comments{
				c.UnLikes+=1
				unlikes = c.UnLikes
			}
		}
		conn.Add(prof_in)
		authenticated = "true"
		status = http.StatusOK
		
	}
	c.JSON(status, gin.H{"authenticated":authenticated, "likes":likes})
}


func GetProfile(c *gin.Context) {
	conn := store.New(c)

	prof_id, _ := strconv.ParseInt(c.Param("prof_id"), 10, 64)
	det_id, _ := strconv.ParseInt(c.Param("det_id"), 10, 64)
	det_key := conn.DatastoreKeyWithKind("ProfileDetails", det_id)
	prof_in := &Profile{Id: prof_id, Parent: det_key}

	conn.Get(prof_in)

	var pout_t ProfileOut
	det_list := &datastore.PropertyList{}
	conn.PropListGet(det_list, prof_in.Parent)
	pout_t.Details = PropertyListToMap(det_list)
	pout_t.Details["id"] = prof_in.Parent.IntID()
	pout_t.Comments = prof_in.Comments
	pout_t.Consti = prof_in.Consti
	pout_t.Id = prof_in.Id
	pout_t.Meta = prof_in.Meta

	c.JSON(http.StatusOK, pout_t)
}

func PutProfile(c *gin.Context) {

	conn := store.New(c)
	status := http.StatusOK

	prof_out := &ProfileOut{}
	c.BindJSON(prof_out)

	var resp store.Response
	keys := make(map[string]int64)

	if auth.IsAuthorized(c, prof_out.Consti) {
		det_id := NumberToInt(prof_out.Details["id"])
		det_key := conn.DatastoreKeyWithKind("ProfileDetails", det_id)
		det_list := &datastore.PropertyList{}
		log.Debugf(conn.Context, fmt.Sprintf("before conv %#v", det_list))
		det_list = MapToPropertyList(prof_out.Details)
		log.Debugf(conn.Context, fmt.Sprintf("after conv %#v", det_list))
		det_key = conn.PropListPut(det_list, det_key)
		log.Debugf(conn.Context, fmt.Sprintf("details %#v", det_list))

		prof_in := &Profile{Id: prof_out.Id, Parent: det_key}
		conn.Get(prof_in)
		prof_in.Parent = det_key
		prof_in.Comments = prof_out.Comments
		prof_in.Consti = prof_out.Consti
		prof_in.Meta = prof_out.Meta
		resp = conn.Add(prof_in)

		keys["prof_id"] = resp.Data.(*datastore.Key).IntID()
		keys["det_id"] = det_key.IntID()
		log.Debugf(conn.Context, fmt.Sprintf("%#v", prof_in))

	} else {
		status = http.StatusUnauthorized
	}

	auth.SessionSave(c)
	c.JSON(status, keys)

}

func DeleteProfile(c *gin.Context) {

	conn := store.New(c)
	status := http.StatusOK
	var resp store.Response
	prof_id, _ := strconv.ParseInt(c.Param("prof_id"), 10, 64)
	det_id, _ := strconv.ParseInt(c.Param("det_id"), 10, 64)
	det_key := conn.DatastoreKeyWithKind("ProfileDetails", det_id)
	prof_in := &Profile{Id: prof_id, Parent: det_key}

	conn.Get(prof_in)

	if auth.IsAuthorized(c, prof_in.Consti) {
		log.Debugf(conn.Context, fmt.Sprintf("profiles %#v", prof_in))
		resp = conn.Remove(conn.Goon.Key(prof_in))
		resp = conn.Remove(prof_in.Parent)

	} else {
		status = http.StatusUnauthorized
	}

	auth.SessionSave(c)
	c.JSON(status, resp)
}

func AddComment(c *gin.Context) {

	var prof_in *Profile
	status := http.StatusOK
	if auth.IsAuthenticated(c) {

		conn := store.New(c)
		var comment Comment
		c.BindJSON(&comment)

		prof_id, _ := strconv.ParseInt(comment.Prof_Id, 10, 64)
		det_id, _ := strconv.ParseInt(comment.Det_Id, 10, 64)
		det_key := conn.DatastoreKeyWithKind("ProfileDetails", det_id)
		prof_in = &Profile{Id: prof_id, Parent: det_key}
		conn.Get(prof_in)

		comment.Id = uuid.NewV4().String()
		comment.Time = time.Now().Format("2006-01-02 15-04-05")
		prof_in.Comments = append(prof_in.Comments, comment)
		conn.Add(prof_in)

		status = http.StatusOK

	} else {
		auth.SessionSave(c)
		auth.Login(c)
	}

	c.JSON(status, prof_in.Comments)
}

func FilterProfile(c *gin.Context) {
	conn := store.New(c)
	consti := c.Param("id")

	prof_list := make([]Profile, 0)
	out_list := make([]ProfileOut, 0)
	conn.List(&prof_list)

	var prof Profile
	for _, prof = range prof_list {
		if prof.Consti == consti {
			var pout_t ProfileOut
			det_list := &datastore.PropertyList{}
			conn.PropListGet(det_list, prof.Parent)
			pout_t.Details = PropertyListToMap(det_list)
			pout_t.Details["id"] = prof.Parent.IntID()
			pout_t.Comments = prof.Comments
			pout_t.Consti = prof.Consti
			pout_t.Id = prof.Id
			pout_t.Meta = prof.Meta
			out_list = append(out_list, pout_t)
		}

	}
	c.JSON(http.StatusOK, out_list)
}

func ListProfile(c *gin.Context) {
	conn := store.New(c)

	prof_list := make([]Profile, 0)
	out_list := make([]ProfileOut, 0)
	conn.List(&prof_list)

	var prof Profile

	for _, prof = range prof_list {
		if auth.IsAuthorized(c, prof.Consti) {
			var pout_t ProfileOut
			det_list := &datastore.PropertyList{}
			conn.PropListGet(det_list, prof.Parent)
			pout_t.Details = PropertyListToMap(det_list)
			pout_t.Details["id"] = prof.Parent.IntID()
			pout_t.Comments = prof.Comments
			pout_t.Consti = prof.Consti
			pout_t.Id = prof.Id
			pout_t.Meta = prof.Meta
			
			out_list = append(out_list, pout_t)
		}

	}

	auth.SessionSave(c)
	c.JSON(http.StatusOK, out_list)
}

func MapToPropertyList(det_map map[string]interface{}) *datastore.PropertyList {
	var ret = make([]datastore.Property, 0)
	for k, v := range det_map {
		/*		if k == "id" {
				v = NumberToInt(det_map[k])
			}*/
		no_index := false
		multiple := false
		if k == "htmlContent" {
			v = []byte(v.(string))
			no_index = true
			multiple = true
		}

		ret = append(ret, datastore.Property{
			Name:     k,
			Value:    v,
			NoIndex:  no_index,
			Multiple: multiple,
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
		if prop.Name == "htmlContent" {
			prop.Value = string(prop.Value.([]byte)[:])
		}
		ret[prop.Name] = prop.Value
	}

	return ret
}

func NumberToInt(n interface{}) int64 {
	if n == nil {
		return 0
	}
	return int64(n.(float64))
}
