package kyp

import (
	"github.com/gin-gonic/gin"
	"github.com/kyp/geo"
	"github.com/kyp/log"
	"github.com/kyp/models"
	"github.com/kyp/service"
	"github.com/kyp/social"

	//"google.golang.org/appengine"
	"net/http"
	//      "github.com/dpapathanasiou/go-recaptcha"
)

func init() {
	// Starts a new Gin instance with no middle-ware
	r := gin.Default()
	r.Use(log.Logger())
	r.Use(gin.Recovery())

	r.LoadHTMLGlob("templates/*")
	r.Static("/assets", "./assets")

	r.POST("/user", AddUser)
	r.GET("/user", ListUser)
	r.GET("/load", LoadConst)
	r.POST("/point", Point)

	r.GET("/profile/:prof_id/:det_id", GetProfile)
	r.POST("/profile", PutProfile)
	r.DELETE("/profile/:prof_id/:det_id", DeleteProfile)
	r.GET("/profile", ListProfile)

	r.GET("/consti/:id", FilterConstiProfile)

	r.GET("/", Home)
	r.GET("/admin", Admin)
	r.GET("/fb", social.Home)
	r.GET("/FBLogin", social.FBLogin)

	http.Handle("/", r)
	//appengine.Main()
	/*
	   authorized := r.Group("/write")

	   authorized.Use(Auth())
	   {
	      authorized.POST("/login", loginEndpoint)
	   }*/

}

func FilterConstiProfile(c *gin.Context) {
	service.FilterProfile(c)
}

func GetProfile(c *gin.Context) {
	service.GetProfile(c)
}

func ListProfile(c *gin.Context) {
	service.ListProfile(c)
}

func PutProfile(c *gin.Context) {
	service.PutProfile(c)
}

func DeleteProfile(c *gin.Context) {
	service.DeleteProfile(c)
}

func Home(c *gin.Context) {
	c.HTML(http.StatusOK, "index.html", gin.H{})
}

func Admin(c *gin.Context) {
	c.HTML(http.StatusOK, "admin.html", gin.H{})
}

func getStore(c *gin.Context) *service.Connection {
	return service.New(c)
}

func AddUser(c *gin.Context) {
	rec := &models.Record{}
	c.BindJSON(rec)
	DAO := getStore(c)
	resp := DAO.Add(rec)
	c.JSON(http.StatusOK, resp)
}

func ListUser(c *gin.Context) {
	rec := &[]models.Record{}
	DAO := getStore(c)
	resp := DAO.List(rec)
	c.JSON(http.StatusOK, resp)
}

func LoadConst(c *gin.Context) {
	geo.LoadPolygonFromFile(c, getStore(c))
}

func Point(c *gin.Context) {
	rec := &geo.Point{}
	c.BindJSON(rec)
	resp := geo.PointInPolygon(c, getStore(c), rec.Lat, rec.Lng)
	c.JSON(http.StatusOK, resp)
}
