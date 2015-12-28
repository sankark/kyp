package geo

import (
	"encoding/json"
	geo "github.com/kellydunn/golang-geo"
	"github.com/kpawlik/geojson"
	"github.com/kyp/service"
	"google.golang.org/appengine/datastore"
	"os"
	"sync"
)

type Point struct {
	Lng float64
	Lat float64
}

var PolygonCache map[int64]geo.Polygon
var Init = false

func init() {

}

type Constituency struct {
	Id           int64 `datastore:"-" goon:"id"`
	Parl_Const   string
	Assemb_Const string
	State        string
	Points       []Point
}

func LoadPolygonFromFile(conn *service.Connection) {

	filename := "C:/Users/priya_000/Downloads/tnassemble.zip.geojson"
	f_coll := new(geojson.FeatureCollection)
	file, _ := os.Open(filename)
	jsonParser := json.NewDecoder(file)
	jsonParser.Decode(&f_coll)
	for _, feature := range f_coll.Features {
		p := make([]Point, 0)
		constituency := &Constituency{}
		prop := feature.Properties
		constituency.Assemb_Const = prop["ac_name"].(string)
		constituency.Parl_Const = prop["pc_name"].(string)
		constituency.State = prop["state"].(string)
		geom, _ := feature.GetGeometry()
		multiline := geom.GetGeometry()
		mli := multiline.(geojson.MultiLine)
		for _, coord := range mli {
			for _, point := range coord {
				lon := float64(point[0])
				lat := float64(point[1])
				p = append(p, Point{Lat: lat, Lng: lon})
			}
		}
		constituency.Points = p
		conn.Add(constituency)
	}

}

func merge(cs []<-chan int64) <-chan int64 {
	var wg sync.WaitGroup
	out := make(chan int64)

	// Start an output goroutine for each input channel in cs.  output
	// copies values from c to out until c is closed, then calls wg.Done.
	output := func(c <-chan int64) {
		for n := range c {
			out <- n
		}
		wg.Done()
	}
	wg.Add(len(cs))
	for _, c := range cs {
		go output(c)
	}

	// Start a goroutine to close out once all the output goroutines are
	// done.  This must start after the wg.Add call.
	go func() {
		wg.Wait()
		close(out)
	}()
	return out
}

func Process(id int64, search *geo.Point) <-chan int64 {
	out := make(chan int64)
	go func() {
		if Cache[id].Contains(search) {
			out <- id
		} else {
			out <- 0
		}
		close(out)
	}()
	return out
}
func PointInPolygon(conn *service.Connection, lat float64, lon float64) service.Response {

	chans := make([]<-chan int64, 0)
	search := geo.NewPoint(lat, lon)
	resp := conn.ListKeys(Constituency{})
	keys := resp.Data.([]*datastore.Key)
	for _, k := range keys {
		if Cache[k.IntID()] == nil {
			con := &Constituency{Id: k.IntID()}
			resp = conn.Get(con)
			Cache[k.IntID()] = BuildPolygon(con)
		}
		chans = append(chans, Process(k.IntID(), search))
	}
	for n := range merge(chans) {
		if n != 0 {
			con := &Constituency{Id: n}
			resp = conn.Get(con)
			con.Points = nil
			resp.Data = con
		}
	}
	return resp
}

func BuildPolygon(con *Constituency) (polygon *geo.Polygon) {
	polygon = &geo.Polygon{}
	for _, p := range con.Points {
		gp := geo.NewPoint(p.Lat, p.Lng)
		polygon.Add(gp)
	}
	return polygon
}

/*func PointInPolygon(conn *service.Connection, lat float64, lon float64) service.Response {

	resp := conn.List(&[]Constituency{})
	con := resp.Data.(*[]Constituency)
	pos := geo.NewPoint(lat, lon)
	for _, c := range *con {
		polygon := &geo.Polygon{}
		for _, p := range c.Points {
			gp := geo.NewPoint(p.Lat, p.Lng)
			polygon.Add(gp)
		}

		contains := polygon.Contains(pos)
		log.Print(c.Assemb_Const)
		log.Print(contains)
	}

	return resp
}*/
