package kyp

import (
	"github.com/gin-gonic/gin"
	"github.com/kyp/geo"
	"github.com/kyp/log"
	"github.com/kyp/models"
	"github.com/kyp/service"
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

	r.GET("/profile/:id", GetProfile)
	r.POST("/profile", PutProfile)
	r.DELETE("/profile", DeleteProfile)
	r.GET("/profile", ListProfile)

	r.GET("/", Home)

	http.Handle("/", r)
	//appengine.Main()
}

func GetProfile(c *gin.Context) {
	profile := &service.Profile{}
	profile.GetProfile(c)
}

func ListProfile(c *gin.Context) {
	profile := &service.Profile{}
	profile.ListProfile(c)
}

func PutProfile(c *gin.Context) {
	profile := &service.Profile{}
	profile.PutProfile(c)
}

func DeleteProfile(c *gin.Context) {
	profile := &service.Profile{}
	profile.DeleteProfile(c)
}

func Home(c *gin.Context) {
	c.HTML(http.StatusOK, "home.html", gin.H{})
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
