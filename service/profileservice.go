package service

import (
	"fmt"
	"net/http"
	"sort"
	"strconv"

	"github.com/kyp"

	"github.com/mjibson/goon"

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
	Id      string `json:"id"`
	Text    string `json:"text"`
	Time    string
	Likes   int64  `json:"likes" datastore:"likes"`
	Author  string `json:"author" datastore:"author"`
	UnLikes int64  `json:"unlikes" datastore:"unlikes"`
}

type Survey struct {
	Prof_Id string `json:"prof_id"`
	Det_Id  string `json:"det_id"`
	Id      string `json:"id"`
	Text    string `json:"text"`
	Time    string
	Likes   int64  `json:"likes" datastore:"likes"`
	Author  string `json:"author" datastore:"author"`
	UnLikes int64  `json:"unlikes" datastore:"unlikes"`
}

type Meta struct {
	MValue string `json:"value" datastore:"value"`
	MKey   string `json:"key" datastore:"key"`
}

type Profile struct {
	Id       int64          `datastore:"-" goon:"id"`
	Parent   *datastore.Key `datastore:"-" goon:"parent"`
	Consti   string         `json:"consti" datastore:"consti"`
	Comments []Comment      `json:"comments" datastore:"comments"`
	Surveys  []Survey       `json:"surveys" datastore:"surveys"`
	Meta     []Meta         `json:"meta" datastore:"meta"`
	Likes    int64          `json:"likes" datastore:"likes"`
	UnLikes  int64          `json:"unlikes" datastore:"unlikes"`
	Status   string         `json:"status" datastore:"status"`
}

type ProfileOut struct {
	Id       int64                  `json:"id" binding:"required" datastore:"-" goon:"id"`
	Details  map[string]interface{} `json:"details" binding:"required"`
	Consti   string                 `json:"consti" datastore:"consti"`
	Comments []Comment              `json:"comments"`
	Surveys  []Survey               `json:"surveys"`
	Meta     []Meta                 `json:"meta" datastore:"meta"`
	Likes    int64                  `json:"likes" datastore:"likes"`
	UnLikes  int64                  `json:"unlikes" datastore:"unlikes"`
}

func AddLikes(c *gin.Context) {
	status := http.StatusOK
	var likes int64
	authenticated := "false"
	if auth.IsAuthenticated(c) {
		authenticated = "true"
		conn := store.New(c)
		prof_id, _ := strconv.ParseInt(c.Param("prof_id"), 10, 64)
		det_id, _ := strconv.ParseInt(c.Param("det_id"), 10, 64)
		det_key := conn.DatastoreKeyWithKind("ProfileDetails", det_id)
		prof_in := &Profile{Id: prof_id, Parent: det_key}

		conn.Get(prof_in)

		user := auth.GetUser(c)
		like_type := c.Query("type")
		like_id := c.Query("like_id")
		var incr = 1

		if auth.IsLiked(c, like_id) {
			incr = -1
			sort.Strings(user.Likes)
			i := sort.SearchStrings(user.Likes, like_id)
			user.Likes = append(user.Likes[:i], user.Likes[i+1:]...)
		} else {
			user.Likes = append(user.Likes, like_id)
		}
		conn.Goon.RunInTransaction(func(Goon *goon.Goon) error {
			Goon.Put(&user)
			return nil
		}, nil)
		if like_type == "profile" {
			prof_in.Likes += int64(incr)
			likes = prof_in.Likes
		}
		if like_type == "comment" {
			for i, comm := range prof_in.Comments {
				if comm.Id == like_id {
					prof_in.Comments[i].Likes += int64(incr)
					likes = prof_in.Comments[i].Likes
				}
			}
		}
		if like_type == "survey" {
			for i, surv := range prof_in.Surveys {
				if surv.Id == like_id {
					prof_in.Surveys[i].Likes += int64(incr)
					likes = prof_in.Surveys[i].Likes
				}
			}
		}
		conn.Add(prof_in)
		authenticated = "true"
		status = http.StatusOK

	}
	c.JSON(status, gin.H{"authenticated": authenticated, "likes": likes})

}

func AddUnLikes(c *gin.Context) {
	status := http.StatusOK
	var unlikes int64
	authenticated := "false"
	if auth.IsAuthenticated(c) {
		authenticated = "true"
		conn := store.New(c)
		prof_id, _ := strconv.ParseInt(c.Param("prof_id"), 10, 64)
		det_id, _ := strconv.ParseInt(c.Param("det_id"), 10, 64)
		det_key := conn.DatastoreKeyWithKind("ProfileDetails", det_id)
		prof_in := &Profile{Id: prof_id, Parent: det_key}

		conn.Get(prof_in)

		user := auth.GetUser(c)
		like_type := c.Query("type")
		like_id := c.Query("like_id")
		var incr = 1

		if auth.IsUnLiked(c, like_id) {
			incr = -1
			sort.Strings(user.Unlikes)
			i := sort.SearchStrings(user.Unlikes, like_id)
			user.Unlikes = append(user.Unlikes[:i], user.Unlikes[i+1:]...)
		} else {
			user.Unlikes = append(user.Unlikes, like_id)
		}
		conn.Goon.RunInTransaction(func(Goon *goon.Goon) error {
			Goon.Put(&user)
			return nil
		}, nil)

		if like_type == "profile" {
			prof_in.UnLikes += int64(incr)
			unlikes = prof_in.UnLikes
		}
		if like_type == "comment" {
			for i, comm := range prof_in.Comments {
				if comm.Id == like_id {
					prof_in.Comments[i].UnLikes += int64(incr)
					unlikes = prof_in.Comments[i].UnLikes
				}
			}
		}

		if like_type == "survey" {
			for i, surv := range prof_in.Surveys {
				if surv.Id == like_id {
					prof_in.Surveys[i].UnLikes += int64(incr)
					unlikes = prof_in.Surveys[i].UnLikes
				}
			}
		}

		conn.Add(prof_in)
		authenticated = "true"
		status = http.StatusOK

	}
	c.JSON(status, gin.H{"authenticated": authenticated, "unlikes": unlikes})
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
	pout_t.Surveys = prof_in.Surveys
	pout_t.Consti = prof_in.Consti
	pout_t.Id = prof_in.Id
	pout_t.Meta = prof_in.Meta
	pout_t.Likes = prof_in.Likes
	pout_t.UnLikes = prof_in.UnLikes

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
		prof_in.Surveys = prof_out.Surveys
		if prof_in.Comments == nil {
			prof_in.Comments = make([]Comment, 0)
		}
		if prof_in.Surveys == nil {
			prof_in.Surveys = make([]Survey, 0)
		} else {
			for i, surv := range prof_in.Surveys {
				if surv.Id == "" {
					prof_in.Surveys[i].Id = uuid.NewV4().String()
				}
			}
		}
		prof_in.Consti = prof_out.Consti
		prof_in.Meta = prof_out.Meta
		resp = conn.Add(prof_in)

		keys["prof_id"] = resp.Data.(*datastore.Key).IntID()
		keys["det_id"] = det_key.IntID()

		for i, surv := range prof_in.Surveys {
			if surv.Prof_Id == "" {
				t_p_id := strconv.FormatInt(keys["prof_id"], 10)
				t_det_id := strconv.FormatInt(keys["det_id"], 10)
				prof_in.Surveys[i].Prof_Id = t_p_id
				prof_in.Surveys[i].Det_Id = t_det_id
			}
		}
		conn.Add(prof_in)
		log.Debugf(conn.Context, fmt.Sprintf("%#v", prof_in))

	} else {
		status = http.StatusUnauthorized
	}

	auth.SessionSave(c)
	c.JSON(status, keys)

}

func PutSampleProfile(c *gin.Context) {

	conn := store.New(c)
	status := http.StatusOK

	if auth.IsAuthorized(c, "admin") {
		prof_id, _ := strconv.ParseInt(c.Param("prof_id"), 10, 64)
		det_id, _ := strconv.ParseInt(c.Param("det_id"), 10, 64)
		det_key := conn.DatastoreKeyWithKind("ProfileDetails", det_id)
		det_list := &datastore.PropertyList{}
		conn.PropListGet(det_list, det_key)
		prof_in := &Profile{Id: prof_id, Parent: det_key}

		conn.Get(prof_in)

		for _, consti := range kyp.GetConstis() {
			prof_in.Id = 0
			prof_in.Consti = consti
			prof_in.Comments = make([]Comment, 0)
			prof_in.Likes = 0
			prof_in.UnLikes = 0
			prof_in.Status = "active"
			s_det_key := conn.DatastoreKeyWithKind("ProfileDetails", 0)
			det_key = conn.PropListPut(det_list, s_det_key)
			prof_in.Parent = det_key
			for i, _ := range prof_in.Surveys {
				prof_in.Surveys[i].Id = uuid.NewV4().String()
				prof_in.Surveys[i].Prof_Id = ""
				prof_in.Surveys[i].Det_Id = ""
				prof_in.Surveys[i].Likes = 0
				prof_in.Surveys[i].UnLikes = 0
			}
			conn.Add(prof_in)

		}

	} else {
		status = http.StatusUnauthorized
	}

	auth.SessionSave(c)
	c.JSON(status, gin.H{"msg": "succesfully loaded"})

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
		comment.Author = auth.GetUser(c).Name
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
			pout_t.Surveys = prof.Surveys
			pout_t.Consti = prof.Consti
			pout_t.Id = prof.Id
			pout_t.Meta = prof.Meta
			pout_t.Likes = prof.Likes
			pout_t.UnLikes = prof.UnLikes
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
			pout_t.Surveys = prof.Surveys
			pout_t.Consti = prof.Consti
			pout_t.Id = prof.Id
			pout_t.Meta = prof.Meta
			pout_t.Likes = prof.Likes
			pout_t.UnLikes = prof.UnLikes
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
