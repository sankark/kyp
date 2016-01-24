var app = angular.module('app', ['ngRoute', 'ngResource', 'frameControllers', 'localytics.directives', 'autocomplete', 'angularFileUpload']);
app.run(function($rootScope, $templateCache, $http) {

    $http.get('templates/saveview.html', {
        cache: $templateCache
    });
    $http.get('templates/claimframe.html', {
        cache: $templateCache
    });
    $http.get('templates/claimsvizframe.html', {
        cache: $templateCache
    });
    $http.get('templates/layerframe.html', {
        cache: $templateCache
    });
    $http.get('templates/policyframe.html', {
        cache: $templateCache
    });
    $http.get('templates/policyvizframe.html', {
        cache: $templateCache
    });
    $http.get('templates/territory.html', {
        cache: $templateCache
    });
    $http.get('templates/viewframe.html', {
        cache: $templateCache
    });
    $http.get('templates/viewplaces.html', {
        cache: $templateCache
    });



});
app.controller('mainCtrl', function($scope, $rootScope, $log, $filter, $http) {


    $scope.policystate = {};
    $scope.templatecount = 0;
    $scope.$on('$includeContentLoaded', function() {
        $scope.templatecount++;

        //if(!cssloaded){
        if ($scope.templatecount == 9) {
            cssPageBindings();
            initializeCustomComponents();
            initializeEventHandlers();
            initializefilters();
            populatePlacesTypes();
        }
        //cssloaded = true;
        //}
    });



    /*$scope.exportPolicy = function(){
		var querystr = constructQueryStringPolicies( createFilterValArrayPolicies());
		var datastr = JSON.stringify(querystr);
		if (querystr == null || querystr.length == 0) {
			return;
		}
		 $http.post('./farmers/data/export/policy', datastr).
		  success(function(data, status, headers, config) {
			  exportExcel(data);		
		  }); 
	 };*/

    $scope.policyViewData = [];
    $scope.claimViewData = [];
    $scope.viewDisplayedCount = 10;
    $scope.applyScope = function() {
        if (newpolicyfetched) {
            $scope.policyIndex = 0;
            $scope.policyViewData = [];
        }

        if (newclaimfetched) {
            $scope.claimIndex = 0;
            $scope.claimViewData = [];
        }

        $scope.loadMorePoliciesOnScroll();
        $scope.loadMoreClaimsOnScroll();
        newpolicyfetched = false;
        newclaimfetched = false;
    };
    $scope.policyIndex = 0;
    $scope.claimIndex = 0;

    $scope.notSorted = function(obj) {
        if (!obj) {
            return [];
        }
        var keys = [];
        for (var key in obj) {
            if (key.toLowerCase().indexOf("hashkey") == -1)
                keys.push(key);
        }
        return keys;
        //return Object.keys(obj);
    };

    $scope.zoomToLatLng = function(policy_number) {
        var req = {
            method: 'GET',
            url: "./farmers/data/getlatlng/" + policy_number,
            headers: {
                'Accept': 'application/json'
            }
        };

        $http(req).success(function(data) {
            map.setZoom(20);
            map.panTo(new google.maps.LatLng(data.latitude, data.longitude));
            //map.setCenter(new google.maps.LatLng(data.latitude,data.longitude));		   			
        }).error(function() {
            //alert("error...");    
            BootstrapDialog.show({
                title: 'Error',
                message: 'Cannot zoom into the selected data.'
            });
        });
    };


    $scope.loadMorePoliciesOnScroll = function() {
        if ($scope.policyIndex < policyViewData.length) {
            for (var i = $scope.policyIndex; i < ($scope.policyIndex + $scope.viewDisplayedCount); i++) {
                if (i < policyViewData.length)
                    $scope.policyViewData.push(policyViewData[i]);
            }
            $scope.policyIndex += $scope.viewDisplayedCount;
        }
    };
    $scope.loadMoreClaimsOnScroll = function() {
        if ($scope.claimIndex < claimsViewdata.length) {
            for (var i = $scope.claimIndex; i < ($scope.claimIndex + $scope.viewDisplayedCount); i++) {
                if (i < claimsViewdata.length)
                    $scope.claimViewData.push(claimsViewdata[i]);
            }
            $scope.claimIndex += $scope.viewDisplayedCount;
        }
    };
    $scope.notNullFilter = function(obj) {
        return user.hasOwnProperty('languages');
    };
    $scope.applyPolicyFilter = function(clickEvent) {
        executeAggregatePolicies($scope, true);
    };
    $scope.resetPolicyFilter = function(clickEvent) {
        resetPolicyFilters($scope);
    };
    $scope.applyClaimFilters = function(clickEvent) {
        executeAggregateClaims($scope, true);
    };
    $scope.resetClaimFilters = function(clickEvent) {
        resetClaimsFilters($scope);
    };

    $scope.exportPolicyDistance = function(clickEvent) {
        exportPolicyDistance($scope);
    };

    $scope.exportClaimDistance = function(clickEvent) {
        exportClaimDistance($scope);
    };
    $scope.viewRetrieve = function(clickEvent) {
        retreiveView($scope);
    };
});
app.filter('customFormatter', function() {
    return function(str, key) {
        if (key.indexOf("limit") != -1) {
            return '$' + str.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
        }
        return str;
    };
});

app.filter('titleCase', function() {
    return function(str) {
        if (null != str) {
            str = str.replace(/_/g, " ");
            return str.replace(/\w\S*/g, function(txt) {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            });
        }
        return str;
    };
});
app.filter('nullHandler', function() {
    return function(str) {
        if (null == str || str == "" || "null" == str.toLowerCase()) {
            return "--";
        }
        return str;
    };
});


app.controller('DistanceController', function($q, $scope, UserService, $timeout, RolesService, AdminService) {
    $scope.b1l = "0";
    $scope.export_types = ["policy", "claim"];
    $scope.dist = {
        export_type: ""
    };
});

app.controller('CustomKMLController', function(FileService, $q, $rootScope, $scope, UserService, $timeout, RolesService, AdminService) {
    var url = "./farmers/data/kml/download/";
    $scope.p_flag = false;
    $scope.docs = [];


    $scope.parseKml = function(kmlKeys) {
        $scope.kmlKeys = kmlKeys;
        $scope.geoParser = new geoXML3.parser({
            map: map,
            afterParse: $scope.useTheData,
            scope: $scope
        });
        var selurl = [];

        angular.forEach(kmlKeys, function(kmlKey, k) {
            var c = true;
            angular.forEach($scope.filesObj, function(value, key) {
                if (c) {
                    if (kmlKey == value.key) {
                        selurl.push(url + value.id);
                        c = false;
                    }
                }
            });
        });

        if (selurl.length > 0)
            $scope.geoParser.parse(selurl, [], kmlKeys);
        $scope.p_flag = true;
    };

    $scope.fileSelect = function() {
        /*	$scope.sel_file_name = [];
        	var selected =  $('.localytics-chosen+.chosen-container-active .chosen-choices .search-choice span');
        	$scope.sel_file_name.push(selected);*/
        if ($scope.sel_file_name.length > 0) {
            kml_layer_selected_obj = [];
            $body.addClass("customloading");
            $scope.parseKml($scope.sel_file_name);
        } else {
            $scope.resetUI();
        }
    };

    $scope.resetUI = function() {
        $scope.sel_file_name = [];
        $scope.p_flag = false;
        $scope.removeAll();
        $scope.placemark = [];
        $scope.docs = [];
    };

    $rootScope.clearKMLView = function() {
        $scope.resetUI();
    };

    $rootScope.clickAllPolygonFromKMLLayer = function() {
        angular.forEach($scope.placemark, function(d, key) {
            angular.forEach(d.doc, function(placemark, k) {
                if (placemark.confirmed == true) {
                    geoXMLObjClicked(placemark, $scope);
                }
            });
        });
    };

    $scope.selectDoc = function(d) {
        if (d.selall)
            $scope.selectByKeyName(d);
        else
            $scope.removeByKeyName(d);
    };

    $scope.selectAll = function() {
        angular.forEach($scope.placemark, function(d, key) {
            $scope.removeByKeyName(d);
            $scope.selectByKeyName(d);
        });
    };

    $scope.selectByKeyName = function(d) {
        d.selall = true;
        angular.forEach(d.doc, function(placemark, key) {
            placemark.confirmed = true;
            placemark.sel_style = "";
            $scope.updatePlaceMark(placemark, false);
        });
        map.fitBounds($scope.getBounds());
    };

    $scope.removeByKeyName = function(d) {
        d.selall = false;
        angular.forEach(d.doc, function(placemark, key) {
            placemark.confirmed = false;
            placemark.selected = false;
            placemark.sel_style = "";
            $scope.updatePlaceMark(placemark, false);
        });
    };
    $scope.removeAll = function() {
        angular.forEach($scope.placemark, function(d, key) {
            $scope.removeByKeyName(d);
        });
    };

    $scope.unhide_markers_kml = function() {
        angular.forEach($scope.geoDocs, function(geoXmlDoc, key) {
            if (geoXmlDoc.markers != null) {
                for (var i = 0; i < geoXmlDoc.markers.length; i++) {
                    geoXmlDoc.markers[i].setVisible(false);
                    geoXmlDoc.markers[i].setMap(null);
                }
            }
        });
    };

    $scope.show_markers_kml = function() {
        angular.forEach($scope.geoDocs, function(geoXmlDoc, key) {
            if (geoXmlDoc.markers != null) {
                for (var i = 0; i < geoXmlDoc.markers.length; i++) {
                    geoXmlDoc.markers[i].setVisible(true);
                    geoXmlDoc.markers[i].setMap(map);
                }
            }
        });
    };




    $scope.useTheData = function(doc) {
        if ($scope.geoParser != null)
            $scope.geoParser.hideDocument();

        $scope.geoDocs = [];
        if (doc == "failed parse") {
            $body.removeClass("customloading");
            BootstrapDialog.show({
                title: 'Error',
                message: "Failed to parse."
            });
            //$("#alertModel").css("display", "block");
            //$("#alertModelLabel").text("Failed to parse");
            return;
        }
        $scope.resetPlaceMark();
        $scope.placemark = [];
        $scope.docs = [];
        var count = 0;
        for (var j = 0; j < doc.length; j++) {
            geoXmlDoc = doc[j];
            var p = {};
            p.keyName = geoXmlDoc.keyName;
            p.doc = [];
            for (var i = 0; i < geoXmlDoc.placemarks.length; i++) {
                var placemark = geoXmlDoc.placemarks[i];
                placemark.id = count;
                if ($scope.reload != null) {
                    if ($scope.reload.ids.indexOf(placemark.id) > -1)
                        placemark.confirmed = true;
                    else
                        placemark.confirmed = false;
                } else {
                    placemark.confirmed = true;
                }
                placemark.sel_style = "";
                p.doc.push(placemark);
                $scope.updatePlaceMark(placemark, false);
                count++;
            }
            p.selall = true;
            $scope.placemark.push(p);
        }
        $scope.reload = null;
        $scope.$apply();
        $body.removeClass("customloading");
        //console.log(res);
    };



    ngscope.getKMLView = function() {
        var v = {
            kmlKeys: $scope.sel_file_name,
            ids: []
        };
        angular.forEach($scope.placemark, function(d, k) {
            angular.forEach(d.doc, function(placemark, key) {
                if (placemark.confirmed) {
                    v.ids.push(placemark.id);
                }
            });
        });
        return v;
    };

    ngscope.reloadKMLView = function(savedView) {
        $scope.resetUI();
        $scope.reload = savedView;
        $scope.sel_file_name = savedView.kmlKeys;
        $scope.parseKml($scope.reload.kmlKeys);
        return $scope.getBounds();
    };


    $scope.resetPlaceMark = function() {

        angular.forEach($scope.placemark, function(d, k) {
            angular.forEach(d.doc, function(placemark, key) {
                if (placemark.polygon != null) {
                    placemark.polygon.setMap(null);
                    selectedKMLPolygon(placemark.polygon, false, null);

                }
                if (placemark.polyline != null) {
                    placemark.polyline.setMap(null);
                }
                if (placemark.marker != null) {
                    placemark.marker.setMap(null);
                }
            });
        });
    };

    $scope.getAllPlacemarkByName = function(doc, pmName, confirmed) {
        var r = [];
        angular.forEach(doc, function(p, k) {
            if (pmName == p.name) {
                p.confirmed = confirmed;
                r.push(p);
            }
        });
        return r;
    };
    $scope.togglePlacemark = function(doc, placemark, fitBounds) {
        var pmArray = $scope.getAllPlacemarkByName(doc, placemark.name, placemark.confirmed);
        angular.forEach(pmArray, function(v, k) {
            $scope.updatePlaceMark(v, fitBounds);
        });
    };
    $scope.updatePlaceMark = function(placemark, fitBounds) {
        if (placemark.polygon != null) {
            if (placemark.confirmed) {
                placemark.polygon.setMap(map);
                if (fitBounds) {
                    //var p = map.getZoom();
                    map.fitBounds($scope.getBounds());
                    //map.setZoom(p);
                }
            } else {
                if (fitBounds) {
                    //var p = map.getZoom();
                    map.fitBounds($scope.getBounds());
                    //map.setZoom(p);

                }
                placemark.confirmed = false;
                placemark.sel_style = "";
                unSelKMLPolygon(placemark);
                selectedKMLPolygon(placemark.polygon, false, null);
                placemark.polygon.setMap(null);
            }

        }
        if (placemark.polyline != null) {
            if (placemark.confirmed) {
                placemark.polyline.setMap(map);
                if (fitBounds) {
                    //var p = map.getZoom();
                    map.fitBounds($scope.getBounds());
                    //map.setZoom(p);
                }
            } else {
                if (fitBounds) {
                    //var p = map.getZoom();
                    map.fitBounds($scope.getBounds());
                    //map.setZoom(p);
                }
                placemark.confirmed = false;
                placemark.selected = false;
                placemark.sel_style = "";
                placemark.polyline.setMap(null);
            }
        }
        if (placemark.marker != null) {
            if (placemark.confirmed) {
                placemark.marker.setMap(map);
                if (fitBounds) {
                    //var p = map.getZoom();
                    map.fitBounds($scope.getBounds());
                    //map.setZoom(p);
                }
            } else {
                if (fitBounds) {
                    //var p = map.getZoom();
                    map.fitBounds($scope.getBounds());
                    //map.setZoom(p);
                }
                placemark.confirmed = false;
                placemark.selected = false;
                placemark.sel_style = "";
                placemark.marker.setVisible(false);
                placemark.marker.setMap(null);
            }
        }
    };

    $scope.getBounds = function() {
        var bounds = new google.maps.LatLngBounds();
        angular.forEach($scope.placemark, function(d, k) {
            angular.forEach(d.doc, function(placemark, key) {
                if (placemark.confirmed) {
                    if (placemark.polygon != null) {
                        var paths = placemark.polygon.getPaths();
                        for (var i = 0; i < paths.getLength(); i++) {
                            path = paths.getAt(i);
                            for (var ii = 0; ii < path.getLength(); ii++) {
                                bounds.extend(path.getAt(ii));
                            }
                        }
                    } else if (placemark.polyline != null) {
                        var path = placemark.polyline.getPath();
                        for (var i = 0; i < path.getLength(); i++) {
                            bounds.extend(path.getAt(i));
                        }
                    } else if (placemark.marker != null) {
                        bounds.extend(placemark.marker.getPosition());
                    }

                }

            });
        });
        return bounds;

    };

    $scope.createCustomOverlay = function(overlay) {
        var overlayLayer = geoParser.createMarker(overlay);
        google.maps.event.addListener(overlayLayer, 'click', function(E) {
            document.getElementById('info-box').textContent = event.feature.getProperty('name');
        });
        return overlayLayer;
    };




});


app.controller('UploadController', function(FileUploader, uploadManager, $rootScope, fileUpload, FileService, $q, $scope, UserService, $timeout, RolesService, AdminService) {
    $scope.file_types = ["test"];
    $scope.file_type;
    $scope.sel = {};
    $scope.myFile = null;

    var div = document.createElement("div");
    div.innerHTML = "<!--[if lt IE 10]><i></i><![endif]-->";
    var isIeLessThan10 = (div.getElementsByTagName("i").length == 1);



    $scope.uploadKML = function() {
        if ($scope.key == null || $scope.key.trim().length == 0) {
            BootstrapDialog.show({
                title: 'Error',
                message: "Please enter KML name"
            });
            return;
        }
        if ($scope.uploader.queue.length == 0) {
            BootstrapDialog.show({
                title: 'Error',
                message: "Please select KML file"
            });
            return;
        }
        $scope.uploader.queue[0].upload();
    };

    var uploader = $scope.uploader = new FileUploader({
        url: './farmers/data/kml/upload',
        removeAfterUpload: true
    });

    // FILTERS

    uploader.filters.push({
        name: 'customFilter',
        fn: function(item /*{File|FileLikeObject}*/ , options) {
            if (this.queue.length == 1)
                this.queue.splice(0);
            return true;
        }
    });

    uploader.filters.push({
        name: 'validateFileExtension',
        fn: function(item /*{File|FileLikeObject}*/ , options) {
            var re = /(\.kml|\.KML|\.Kml)$/i;
            if (!re.exec(item.name)) {
                BootstrapDialog.show({
                    title: 'Error',
                    message: "Please upload KML files only."
                });
                //$("#alertModel").css("display", "block");
                //$("#alertModelLabel").text("Please upload KML files");
                $('#kml_file').val('');
                return false;
            }
            return true;
        }
    });

    // CALLBACKS

    $scope.uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/ , filter, options) {};
    $scope.uploader.onAfterAddingFile = function(fileItem) {};
    $scope.uploader.onAfterAddingAll = function(addedFileItems) {};
    $scope.uploader.onBeforeUploadItem = function(item) {
        $body.addClass("customloading");
    };
    $scope.uploader.onProgressItem = function(fileItem, progress) {};
    $scope.uploader.onProgressAll = function(progress) {};
    $scope.uploader.onSuccessItem = function(fileItem, response, status, headers) {
        if (isIeLessThan10) {
            response = response.replace(/<pre>/g, '');
            response = response.replace(/<\/pre>/g, '');
            response = response.replace(/\n/g, '');
            response = response.replace(/ /g, '');
            response = JSON.parse(response);
        }
        $scope.onUploadSuccess(response);
    };
    $scope.uploader.onErrorItem = function(fileItem, response, status, headers) {};
    $scope.uploader.onCancelItem = function(fileItem, response, status, headers) {};
    $scope.uploader.onCompleteItem = function(fileItem, response, status, headers) {};
    $scope.uploader.onCompleteAll = function() {};


    $scope.files = [];
    $scope.percentage = 0;

    $scope.upload = function() {
        uploadManager.upload();
        $scope.files = [];
    };

    $rootScope.$on('fileAdded', function(e, call) {
        $scope.files.push(call);
        $scope.$apply();
    });

    $rootScope.$on('uploadProgress', function(e, call) {
        $scope.percentage = call;
        $scope.$apply();
    });


    $scope.onUploadSuccess = function(res) {

        console.log(res);
        if (res.error != null) {
            $body.removeClass("customloading");
            BootstrapDialog.show({
                title: res.error,
                message: res.reason
            });
            $('#kml_file').val('');
            return;
        }
        res.key = $scope.key;
        res.name = uploader.queue[0].file.name;
        res.inputStream = "";
        res.outputStream = "";
        res.resource_id = res.resourceId;
        res.description = "KML layer";
        res.type = "KML";
        $scope.addmeta(res);
        //$scope.reloadKmlFiles();

    };
    $scope.uploadFile = function() {
        $body.addClass("customloading");
        var file = $scope.myFile[0];
        console.log('file is ' + file);
        var uploadUrl = "./farmers/data/kml/upload";
        fileUpload.uploadFileToUrl(file, uploadUrl, $scope.onUploadSuccess);
    };

    $scope.addmeta = function(meta) {
        var fProm = FileService.addMeta(meta);
        fProm.then(function(res) {
            $body.removeClass("customloading");
            if (res.error != null) {
                BootstrapDialog.show({
                    title: res.error,
                    message: res.reason
                });
            } else {
                BootstrapDialog.show({
                    title: 'Success!',
                    message: "File uploaded successfully."
                });
            }
            //$("#alertModel").css("display", "block");
            //$("#alertModelLabel").text("File uploaded successfully");
            ngscope.filesObj.push({
                key: $scope.key,
                id: res.id
            });
            ngscope.setKeys();
            digestScope();
            $('#kml_file').val('');
            $scope.key = null;
        });
    };


    $scope.shapeNameChanged = function(key) {
        if (null != key && key.trim().length > 0) {
            if (ngscope.files.indexOf(key) > -1) {
                BootstrapDialog.show({
                    title: 'Error',
                    message: "KML name(" + key + ") exists! Please enter different name"
                });
                $scope.key = null;
            }
        }
    };

});


app.controller('RootController', function(FileService, $templateCache, $q, $scope, UserService, $timeout, RolesService, AdminService) {
    ngscope = $scope;
    $scope.login = {
        name: "",
        defRole: "",
        roles: ""
    };
    $scope.header = {
        upload: false,
        distance: false,
        places: false,
        layer: false,
        save_view: false,
        last_selected: "x",
        map_territory: false,
        x: false
    };
    $scope.showActiveUsers = true;
    $scope.hideDisabledUsers = true;
    $scope.views = {};
    $scope.exist = {
        userList: [],
        euserid: ""
    };
    var userPromise = UserService.getUser();
    $scope.login.defRole = "";
    $scope.login.defRoleObj;
    $scope.prev = "";
    $scope.g_selected_polygons = g_selected_polygons;
    $scope.sel_cur_index = 0;

    $scope.clearSelectedPolygons = function() {
        clearSelectedPolygons();
    };

    $scope.selectAllPolygonsOnMap = function() {
        selectAllPolygonsOnMap();
    };

    $scope.toggleLegend = function() {
        $("#legenddisplaydiv").slideToggle("size");
    };

    $scope.toggleLegendIndividualItems = function(id, state) {
        //$("#legenddisplaydiv").slideToggle("size");
    };

    $scope.sel_polygon_clicked = function() {
        if ($scope.sel_cur_index >= $scope.g_selected_polygons.length)
            $scope.sel_cur_index = 0;
        if ($scope.sel_cur_index < 0)
            $scope.sel_cur_index = $scope.g_selected_polygons.length - 1;
        if ($scope.g_selected_polygons.length > 0)
            try {
                map.fitBounds($scope.g_selected_polygons[$scope.sel_cur_index].getBounds());
            } catch (e) {
                map.fitBounds(getBoundsofMapFeatures($scope.g_selected_polygons[$scope.sel_cur_index]));
            }
    };

    $scope.sel_polygon_fitall = function() {
        if ($scope.g_selected_polygons.length > 0)
            map.fitBounds($scope.getBoundsForPolygonCollection($scope.g_selected_polygons));
    };
    ngscope.removemeta = function(key) {
        var fProm = FileService.removeMeta(key);
        fProm.then(function(res) {
            $body.removeClass("customloading");
            if (res.error != null) {
                BootstrapDialog.show({
                    title: res.error,
                    message: res.reason
                });
            } else {
                BootstrapDialog.show({
                    title: 'Success!',
                    message: "File Deleted successfully."
                });
                $scope.reloadKmlFiles();
            }
            //$("#alertModel").css("display", "block");
            //$("#alertModelLabel").text("File uploaded successfully");

        });
    };
    $scope.getBoundsForPolygonCollection = function(collection) {
        var bounds = new google.maps.LatLngBounds();
        angular.forEach(collection, function(p, key) {
            try {
                bounds.union(p.getBounds());
            } catch (e) {
                bounds.union(getBoundsofMapFeatures(p));
            }

        });
        return bounds;
    };
    $scope.toggleHeadings = function(sel) {
        if (sel == 'map') {
            $scope.header[$scope.header.last_selected] = false;
            return;
        } else {
            if (sel !== $scope.header.last_selected) {
                $scope.header[$scope.header.last_selected] = false;
            }
            $scope.header[sel] = !$scope.header[sel];
            $scope.header.last_selected = sel;
        }
    };

    $scope.setKeys = function() {
        $scope.files = [];
        angular.forEach($scope.filesObj, function(value, key) {
            $scope.files.push(value.key);
        });
    };

    $scope.reloadKmlFiles = function() {
        $scope.files = [];
        var f = true;
        var fProm = FileService.listFiles();
        fProm.then(function(r) {
            $scope.filesObj = r;
            $scope.setKeys();
            listKml();
        });

    };

    $scope.reloadKmlFiles();

    userPromise.then(function(user) {
        $scope.login.name = user.username;
        $scope.currentuser = $scope.login.name;
        var rolesPromise = UserService.getRoles();
        rolesPromise.then(function(roles) {
            $scope.login.roles = roles;
            for (var i in roles) {
                if (roles[i].defRole == true) {
                    $scope.login.defRole = roles[i].role;
                    $scope.login.defRoleObj = roles[i];
                }
            }
            if ($scope.login.defRole == "" && roles.length > 0) {
                $scope.login.defRole = roles[0].role;
                $scope.login.defRoleObj = roles[0];
            }
            if ($scope.login.defRoleObj.relationKey == "R0001") {
                $scope.isAdmin = true;
            }

            var protViewsProm = UserService.listProtectedViews($scope.login.defRoleObj.relationKey);
            protViewsProm.then(function(res) {
                angular.forEach(res, function(e, key) {
                    $scope.views[e.view] = true;
                });
            });
        });
    });

    $scope.changeDefRole = function(role) {
        $scope.views = {};
        UserService.changeRole(role.relationKey);
        $scope.login.defRole = role.role;
        $scope.login.defRoleObj = role;
        $scope.clicked = false;
        if ($scope.login.defRoleObj.relationKey == "R0001") {
            $scope.isAdmin = true;
        } else {
            $scope.isAdmin = false;
        }

        var protViewsProm = UserService.listProtectedViews($scope.login.defRoleObj.relationKey);
        protViewsProm.then(function(res) {
            angular.forEach(res, function(e, key) {
                $scope.views[e.view] = true;
            });
        });

    };

    $scope.reloadUserList = function() {
        var usrListProm = AdminService.listUser();

        usrListProm.then(function(v) {
            $scope.exist.userList = v;
        });
    };

    $scope.clearPwd = function(pwd) {
        if (pwd)
            $scope.clearInput('epassword');

    };
    $scope.clearInput = function(ngModel) {
        $scope[ngModel] = null;
    };
    $scope.showAdmin = function() {
        $scope.exist.euserid = "";
        $scope.euserRoles = [];
        $scope.eusername = "";
        $scope.epassword = "";
        $scope.prev = "";
        var rolesPromise = RolesService.getAllRoles();
        rolesPromise.then(function(roles) {
            $scope.roles = roles;
        });

        $scope.reloadUserList();

        $scope.euserRoles = [];
        $scope.userRoles = [];
        $scope.disabled = true;
        $scope.admin = true;
    };

    $scope.updateUser = function() {
        var roleKeys = [];
        for (var r in $scope.euserRoles) {
            if ($scope.euserRoles[r].relationKey != null)
                roleKeys.push($scope.euserRoles[r].relationKey);
        }
        var user = {
            username: $scope.euserid,
            fname: $scope.eusername,
            roleKeys: roleKeys,
            password: $scope.epassword,
            resetPassword: $scope.reset_password,
            salt: $scope.salt
        };
        var adminPromise = AdminService.updateUser(user);
        adminPromise.then(function(resp) {
            console.log(resp);
        });
    };

    $scope.createUser = function() {
        var roleKeys = [];
        for (var r in $scope.userRoles) {
            if ($scope.userRoles[r].relationKey != null)
                roleKeys.push($scope.userRoles[r].relationKey);
        }
        var user = {
            username: $scope.userid,
            fname: $scope.username,
            roleKeys: roleKeys,
            password: $scope.password
        };
        var adminPromise = AdminService.createUser(user);
        adminPromise.then(function(resp) {
            $scope.reloadUserList();
            console.log(resp);
        });
    };

    $scope.removeUser = function() {
        var adminPromise = AdminService.removeUser($scope.euserid);
        adminPromise.then(function(resp) {
            if (resp.status) {
                angular.forEach($scope.exist.userList, function(e, key) {
                    if (e.username == $scope.euserid) {
                        var ind = $scope.exist.userList.indexOf(e);
                        $scope.exist.userList.splice(ind, 1);
                        $scope.exist.euserid = "";
                        $scope.euserid = "";
                        $scope.euserRoles = [];
                        $scope.eusername = "";
                        $scope.prev = "";
                        $scope.epassword = "";
                    }
                });
            }
        });
    };

    $scope.useridChanged = function() {
        $scope.euserid = $('.localytics-chosen+.chosen-container-active .search-choice span').text();
        $scope.exist.euserid = [];
        $scope.exist.euserid.push({
            username: $scope.euserid
        });
        if ($scope.euserid != null && $scope.euserid != "" && $scope.prev == "") {
            $scope.prev = $scope.euserid;
            var rolesPromise = AdminService.getRolesForUser($scope.euserid);
            var userPromise = AdminService.getUserDetail($scope.euserid);
            rolesPromise.then(function(roles) {
                $scope.euserRoles = [];
                for (var i in roles) {
                    $scope.euserRoles.push(roles[i]);
                }

            });

            userPromise.then(function(user) {
                $scope.eusername = user.fname;
                $scope.epassword = user.password;
                $scope.salt = user.salt;

            });
        } else {
            $scope.exist.euserid = "";
            $scope.euserid = "";
            $scope.euserRoles = [];
            $scope.eusername = "";
            $scope.prev = "";
            $scope.epassword = "";
        }
    };

    $scope.reset = function reset() {
        $scope.userid = "";
        $scope.username = "";
        $scope.userRoles = [];

    };

    /*var prom = $timeout(function(){
    				if(map != null){
    					console.log("timeout called");
    				createCustomCountControl();
    				console.log("timeout called");
    				}
    			}, 10000);
	
    $scope.$on('$destroy', function(){
        $timeout.cancel(prom);
    });
    */

});

app.factory('FileService', function($rootScope, $resource, $q) {
    var Res1 = $resource('./farmers/data/kml/list?r=' + Math.random(), {}, {
        'query': {
            method: 'GET',
            isArray: true
        }
    });
    var Res2 = $resource('./farmers/data/kml/meta?r=' + Math.random(), {}, {
        'create': {
            method: 'POST'
        }
    });
    var Res3 = $resource('./farmers/data/kml/remove/:key', {}, {
        'query': {
            method: 'GET'
        }
    });

    return {
        listFiles: function() {
            $body.addClass("customloading");
            var deferred = $q.defer();
            Res1.query({}).$promise.then(function(r) {
                deferred.resolve(r);
                $body.removeClass("customloading");
            }, function(reason) {
                $body.removeClass("customloading");
                BootstrapDialog.show({
                    title: 'Error',
                    message: "Failed to list kml files."
                });
                //$("#alertModel").css("display", "block");
                //$("#alertModelLabel").text("Failed to list user");
            });

            return deferred.promise;
        },
        addMeta: function(meta) {
            var deferred = $q.defer();
            Res2.create(meta).$promise.then(function(r) {
                deferred.resolve(r);
            });

            return deferred.promise;
        },
        removeMeta: function(key) {
            $body.addClass("customloading");
            var deferred = $q.defer();
            Res3.query({
                key: key
            }).$promise.then(function(r) {
                deferred.resolve(r);
            }, function(reason) {
                $body.removeClass("customloading");
                if (reason.data.indexOf("already exists in view") > -1) {
                    BootstrapDialog.show({
                        title: 'Error',
                        message: 'This kml ' + key + ' already exists in view. Delete cannot be performed'
                    });
                } else {
                    BootstrapDialog.show({
                        title: 'Error',
                        message: "Failed to delete kml file."
                    });
                }
                //$("#alertModel").css("display", "block");
                //$("#alertModelLabel").text("Failed to list user");
            });

            return deferred.promise;
        }

    }

});

app.factory('RolesService', function($rootScope, $resource, $q) {
    var RolesAll = $resource('./roles/list?r=' + Math.random(), {}, {
        'query': {
            method: 'GET',
            isArray: true
        }
    });

    return {
        getAllRoles: function() {
            $body.addClass("customloading");
            var deferred = $q.defer();
            RolesAll.query({}).$promise.then(function(roles) {
                deferred.resolve(roles);
                $body.removeClass("customloading");
            }, function(reason) {
                $body.removeClass("customloading");
                BootstrapDialog.show({
                    title: 'Error',
                    message: "Failed to create user, User Exist!."
                });
                //$("#alertModel").css("display", "block");
                //$("#alertModelLabel").text("Failed to create user, User Exist!");
            });

            return deferred.promise;
        }


    }

});

app.factory('AdminService', function($rootScope, $resource, $q) {
    var UserRole = $resource('./admin/roles/:userId?r=' + Math.random(), {}, {
        'query': {
            method: 'GET',
            isArray: true
        }
    });
    var UserList = $resource('./admin/user/:userId?r=' + Math.random(), {}, {
        'query': {
            method: 'GET'
        },
        'remove': {
            method: 'DELETE'
        }
    });
    var ListUser = $resource('./admin/user/list?r=' + Math.random(), {}, {
        'query': {
            method: 'GET',
            isArray: true
        }
    });
    var UserUpdate = $resource('./admin/user?r=' + Math.random(), {}, {
        'update': {
            method: 'PUT'
        }
    });
    var UserCreate = $resource('./admin/user?r=' + Math.random(), {}, {
        'create': {
            method: 'POST'
        }
    });

    return {
        listUser: function() {
            $body.addClass("customloading");
            var deferred = $q.defer();
            ListUser.query({}).$promise.then(function(roles) {
                deferred.resolve(roles);
                $body.removeClass("customloading");
            }, function(reason) {
                $body.removeClass("customloading");
                BootstrapDialog.show({
                    title: 'Error',
                    message: "Failed to list user."
                });
                //$("#alertModel").css("display", "block");
                //$("#alertModelLabel").text("Failed to list user");
            });

            return deferred.promise;
        },
        getRolesForUser: function(userId) {
            $body.addClass("customloading");
            var deferred = $q.defer();
            UserRole.query({
                userId: userId
            }).$promise.then(function(roles) {
                deferred.resolve(roles);
                $body.removeClass("customloading");
            }, function(reason) {
                $body.removeClass("customloading");
                BootstrapDialog.show({
                    title: 'Error',
                    message: "Failed to get Roles for selected user!."
                });
                //$("#alertModel").css("display", "block");
                //$("#alertModelLabel").text("Failed to get Roles for selected user!");
            });

            return deferred.promise;
        },

        getUserDetail: function(userId) {
            $body.addClass("customloading");
            var deferred = $q.defer();
            UserList.query({
                userId: userId
            }).$promise.then(function(roles) {
                deferred.resolve(roles);
                $body.removeClass("customloading");
            }, function(reason) {
                $body.removeClass("customloading");
                BootstrapDialog.show({
                    title: 'Error',
                    message: "Failed to get user detail for selected user."
                });
                //$("#alertModel").css("display", "block");
                //$("#alertModelLabel").text("Failed to get user detail for selected user");
            });

            return deferred.promise;
        },

        updateUser: function(user) {
            $body.addClass("customloading");
            var deferred = $q.defer();
            UserUpdate.update(user).$promise.then(function(roles) {
                deferred.resolve(roles);
                $body.removeClass("customloading");
                BootstrapDialog.show({
                    title: 'Success!',
                    message: "User updated successfully"
                });
            }, function(reason) {
                $body.removeClass("customloading");
                BootstrapDialog.show({
                    title: 'Error',
                    message: "Failed to update user."
                });
                //$("#alertModel").css("display", "block");
                //$("#alertModelLabel").text("Failed to update user");
            });

            return deferred.promise;
        },

        createUser: function(user) {
            $body.addClass("customloading");
            var deferred = $q.defer();
            UserCreate.create(user).$promise.then(function(roles) {
                deferred.resolve(roles);
                $body.removeClass("customloading");
                BootstrapDialog.show({
                    title: 'Success!',
                    message: "User added successfully"
                });
            }, function(reason) {
                $body.removeClass("customloading");
                BootstrapDialog.show({
                    title: 'Error',
                    message: "Failed to create user, User Exist!."
                });
                //$("#alertModel").css("display", "block");
                //$("#alertModelLabel").text("Failed to create user, User Exist!");
            });

            return deferred.promise;
        },
        removeUser: function(userId) {
            $body.addClass("customloading");
            var deferred = $q.defer();
            UserList.remove({
                userId: userId
            }).$promise.then(function(roles) {
                deferred.resolve(roles);
                $body.removeClass("customloading");
                BootstrapDialog.show({
                    title: 'Success!',
                    message: "User removed successfully"
                });
            }, function(reason) {
                $body.removeClass("customloading");
                BootstrapDialog.show({
                    title: 'Error',
                    message: "Failed to remove user."
                });
                //$("#alertModel").css("display", "block");
                //$("#alertModelLabel").text("Failed to remove user");
            });

            return deferred.promise;
        }


    }

});

app.factory('UserService', function($rootScope, $resource, $q) {
    var userIsAuthenticated = false;
    var USER = null;
    var ROLES = null;
    var DEFROLE = null;

    var User = $resource('./user?r=' + Math.random(), {});
    var Roles = $resource('./roles?r=' + Math.random(), {}, {
        'get': {
            method: 'GET',
            isArray: true
        }
    });
    var ChangeDefRole = $resource('./roles/defaultrole/:roleid?r=' + Math.random(), {}, {
        'get': {
            method: 'GET'
        },
        headers: {
            'Content-Type': 'text/html'
        }
    });
    var ViewService = $resource('./view/listview/:roleid?r=' + Math.random(), {}, {
        'get': {
            method: 'GET',
            isArray: true
        }
    });

    return {
        getUser: function() {
            if (!userIsAuthenticated) {
                var deferred = $q.defer();
                USER = deferred.promise;
                USER = User.get({}).$promise.then(function(user) {
                    if (user.username != null) {
                        userIsAuthenticated = true;
                    }
                    deferred.resolve(user);
                });
                USER = deferred.promise;
                return USER;
            } else {
                return USER;
            }
        },

        getRoles: function() {

            if (userIsAuthenticated) {
                var deferred = $q.defer();
                if (ROLES == null) {
                    ROLES = Roles.get({}).$promise.then(function(roles) {
                        deferred.resolve(roles);
                    });

                    ROLES = deferred.promise;
                    return ROLES;
                }

            }
            return ROLES;
        },

        changeRole: function(roleid) {

            if (userIsAuthenticated) {
                $body.addClass("customloading");
                var deferred = $q.defer();
                if (ROLES != null) {
                    DEFROLE = ChangeDefRole.get({
                        roleid: roleid
                    }).$promise.then(function(roles) {
                        deferred.resolve(roles);
                        $body.removeClass("customloading");
                        loadTerritoryData();
                        loadViews();
                        populaterolesAssociation();
                        BootstrapDialog.show({
                            title: 'Success!',
                            message: "Default role successfully changed"
                        });
                        //populateroleview();
                    }, function(reason) {
                        $body.removeClass("customloading");
                        BootstrapDialog.show({
                            title: 'Error',
                            message: "Failed to change role."
                        });
                        //$("#alertModel").css("display", "block");
                        //$("#alertModelLabel").text("Failed to change role");
                    });

                    DEFROLE = deferred.promise;
                    return DEFROLE;
                }

            }
            return DEFROLE;
        },

        listProtectedViews: function(roleid) {

            if (userIsAuthenticated) {
                var deferred = $q.defer();
                if (ROLES != null) {
                    ViewService.get({
                        roleid: roleid
                    }).$promise.then(function(roles) {
                        deferred.resolve(roles);
                    });
                    return deferred.promise;
                }

            }
            return DEFROLE;
        }


    };

});

app.factory('uploadManager', function($rootScope) {
    var _files = [];
    return {
        add: function(file) {
            _files.push(file);
            $rootScope.$broadcast('fileAdded', file.files[0].name);
        },
        clear: function() {
            _files = [];
        },
        files: function() {
            var fileNames = [];
            $.each(_files, function(index, file) {
                fileNames.push(file.files[0].name);
            });
            return fileNames;
        },
        upload: function() {
            $.each(_files, function(index, file) {
                file.submit();
            });
            this.clear();
        },
        setProgress: function(percentage) {
            $rootScope.$broadcast('uploadProgress', percentage);
        }
    };
});

app.directive('upload', ['uploadManager', function factory(uploadManager) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            $(element).fileupload({
                dataType: 'text',
                add: function(e, data) {
                    uploadManager.add(data);
                },
                progressall: function(e, data) {
                    var progress = parseInt(data.loaded / data.total * 100, 10);
                    uploadManager.setProgress(progress);
                },
                done: function(e, data) {
                    uploadManager.setProgress(0);
                }
            });
        }
    };
}]);


app.service('fileUpload', ['$http', function($http) {
    this.uploadFileToUrl = function(file, uploadUrl, onsuccess) {
        var fd = new FormData();
        fd.append('file', file);
        $http.post(uploadUrl, fd, {
                transformRequest: angular.identity,
                headers: {
                    'Content-Type': undefined
                }
            })
            .success(function(r) {
                console.log(r);
            })
            .error(function() {});
    };

    /*this.uploadFileToUrl=function(file, uploadUrl,onsuccess) {
    	file.upload = $upload.upload({
		url: uploadUrl  + "?t=t",
		method: 'POST',
		headers: {
			'Content-Type': file.type
		},
		data: {aaa:'aaa'},
		sendObjectsAsJsonBlob: false,
		file: file,
		fileFormDataName: 'myFile',
    	});
    	
		file.upload.then(function(response) {
			console.log(response);
			$timeout(function() {
				file.result = response.data;
			});
		}, function(response) {
			console.log(response);
			if (response.status > 0)
				$scope.errorMsg = response.status + ': ' + response.data;
		});

		file.upload.progress(function(evt) {
			// Math.min is to fix IE which reports 200% sometimes
			file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
		});

		file.upload.xhr(function(xhr) {
			// xhr.upload.addEventListener('abort', function(){console.log('abort complete')}, false);
		});
    };*/
}]);

app.directive('fileModel', ['$parse', function($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;

            element.bind('change', function() {
                scope.$apply(function() {
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);
app.directive('whenScrolled', function() {
    return function(scope, elm, attr) {
        var raw = elm[0];

        elm.bind('scroll', function() {
            if (raw.scrollTop + raw.offsetHeight >= raw.scrollHeight) {
                scope.$apply(attr.whenScrolled);
            }
        });
    };
});
app.filter('groupBy', ['$parse', function($parse) {
    return function(list, group_by) {

        var filtered = [];
        var prev_item = null;
        var group_changed = false;
        // this is a new field which is added to each item where we append "_CHANGED"
        // to indicate a field change in the list
        //was var new_field = group_by + '_CHANGED'; - JB 12/17/2013
        var new_field = 'group_by_CHANGED';

        // loop through each item in the list
        angular.forEach(list, function(item) {

            group_changed = false;

            // if not the first item
            if (prev_item !== null) {

                // check if any of the group by field changed

                //force group_by into Array
                group_by = angular.isArray(group_by) ? group_by : [group_by];

                //check each group by parameter
                for (var i = 0, len = group_by.length; i < len; i++) {
                    if ($parse(group_by[i])(prev_item) !== $parse(group_by[i])(item)) {
                        group_changed = true;
                    }
                }


            } // otherwise we have the first item in the list which is new
            else {
                group_changed = true;
            }

            // if the group changed, then add a new field to the item
            // to indicate this
            if (group_changed) {
                item[new_field] = true;
            } else {
                item[new_field] = false;
            }

            filtered.push(item);
            prev_item = item;

        });

        return filtered;
    };
}]);
