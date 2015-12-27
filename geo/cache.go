package geo

import (
	geo "github.com/kellydunn/golang-geo"
)

var Cache map[int64]*geo.Polygon

func init() {
	Cache = make(map[int64]*geo.Polygon, 0)
}
