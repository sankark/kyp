package kyp

import (
	"encoding/json"
	"fmt"
	"os"
)

var CONFIG Configuration

type Configuration struct {
	Profile string
	Envs    map[string]map[string]string
	Constis []string
}

func init() {
	file, _ := os.Open("../config.json")
	decoder := json.NewDecoder(file)
	CONFIG = Configuration{}
	err := decoder.Decode(&CONFIG)
	if err != nil {
		fmt.Println("error:", err)
	}
}

func GetProp(key string) string {
	return CONFIG.Envs[CONFIG.Profile][key]
}

func GetProfile(key string) string {
	return CONFIG.Profile
}

func GetConstis() []string {
	return CONFIG.Constis
}
