module.exports = class ParamsHelper {

    static ceaCreatedAt(queryString, params) {
        //Elevation Gain interval
        if (queryString.fromCreatedAt != null || queryString.toCreatedAt != null) {

            if (queryString.fromCreatedAt != null) {
                //from set
                if (queryString.toCreatedAt != null) {
                    //to set
                    params.filter.CreatedAt = {
                        $and: [
                            { $gte: Number(queryString.fromCreatedAt) },
                            { $lte: Number(queryString.toCreatedAt) }
                        ]
                    };
                } else {
                    //to NOT set
                    params.filter.CreatedAt = { $gte: Number(queryString.fromCreatedAt) };
                }
            } else if (queryString.toCreatedAt != null) {
                //from NOT set && to set
                params.filter.CreatedAt = { $lte: Number(queryString.toCreatedAt) };
            }
        }
        return params;
    }  


    static ceaSkip(queryString, params) {
        //Define eventually skip
        if (queryString.skip != undefined)
            params.skip = parseInt(queryString.skip);
        return params;
    }

    static ceaLimit(queryString, params) {
        //Define eventually limit
        if (queryString.limit != undefined)
            params.limit = parseInt(queryString.limit);
        return params;
    }

    static ceaElevationGain(queryString, params) {
        //Elevation Gain interval
        if (queryString.fromElevationGain != null || queryString.toElevationGain != null) {
            
                        if (queryString.fromElevationGain != null) {
                            //from set
                            if (queryString.toElevationGain != null) {
                                //to set
                                params.filter.ElevationGain = {$and : [
                                    { $gte: parseInt(queryString.fromElevationGain) },
                                    { $lte: parseInt(queryString.toElevationGain) }
                                ]};
                            } else {
                                //to NOT set
                                params.filter.ElevationGain = { $gte: parseInt(queryString.fromElevationGain) };
                            }
                        } else if (queryString.toElevationGain != null) {
                            //from NOT set && to set
                            params.filter.ElevationGain = { $lte: parseInt(queryString.toElevationGain) };
                        }
                    }
        return params;
    }

    static ceaDate(queryString, params) {
        //Date interval
        if (queryString.fromDate != null || queryString.toDate != null) {

            if (queryString.fromDate != null) {
                params.filter.Date = { $gte: parseInt(queryString.fromDate) }
            }

            if (queryString.toDate != null) {
                params.filter.Date = { $lte: parseInt(queryString.toDate) }
            }
        }
        return params;
    }

    static ceaStartingAltitude(queryString, params) {
        //Starting Altitude interval
        if (queryString.fromStartingAltitude != null || queryString.toStartingAltitude != null) {

            if (queryString.fromStartingAltitude != null) {
                //from set
                if (queryString.toStartingAltitude != null) {
                    //to set
                    params.filter.StartingAltitude = { 
                        $gte: parseInt(queryString.fromStartingAltitude),
                        $lte: parseInt(queryString.toStartingAltitude)
                    };
                } else {
                    //to NOT set
                    params.filter.StartingAltitude = { $gte: parseInt(queryString.fromStartingAltitude) };
                }
            } else if (queryString.toStartingAltitude != null) {
                //from NOT set && to set
                params.filter.StartingAltitude = { $lte: parseInt(queryString.toStartingAltitude) };
            }


        }
        return params;
    }

    static ceaEndAltitude(queryString, params) {
        //End Altitude interval
        if (queryString.fromEndAltitude != null || queryString.toEndAltitude != null) {

            if (queryString.fromEndAltitude != null) {
                //from set
                if (queryString.toEndAltitude != null) {
                    //to set
                    params.filter.EndAltitude = { 
                        $gte: parseInt(queryString.fromEndAltitude),
                        $lte: parseInt(queryString.toEndAltitude) 
                    };
                } else {
                    //to NOT set
                    params.filter.EndAltitude = { $gte: parseInt(queryString.fromEndAltitude) };
                }
            } else if (queryString.toEndAltitude != null) {
                //from NOT set && to set
                params.filter.EndAltitude = { $lte: parseInt(queryString.toEndAltitude) };
            }
        }
        return params;
    }
    
    static ceaGrade(queryString, params) {
        //Grade
        if (queryString.grade != null) {

            var arr = queryString.grade.split(",");

            if(params.filter.$or == undefined){
                params.filter.$or = [];
            }

            for (var c = 0; c < arr.length; c++) {
                params.filter.$or.push({ Grade: arr[c] });
            }
        }
        return params;
    }

    static ceaRegion(queryString, params) {
        //Region
        if (queryString.region != null) {

            var arr = queryString.region.split(",");

            if(params.filter.$or == undefined){
                params.filter.$or = [];
            }

            for (var c = 0; c < arr.length; c++) {
                params.filter.$or.push({ Region: arr[c] });
            }
        }
        return params;
    }

    static ceaUphillSide(queryString, params) {
        //UphillSide
        if (queryString.uphillSide != null) {

            var arr = queryString.uphillSide.split(",");

            if(params.filter.$or == undefined){
                params.filter.$or = [];
            }

            for (var c = 0; c < arr.length; c++) {
                params.filter.$or.push({ UphillSide: arr[c] });
            }
        }
        return params;
    }

    static ceaDownhillSide(queryString, params) {
        //DownhillSide
        if (queryString.downhillSide != null) {

            var arr = queryString.downhillSide.split(",");

            if(params.filter.$or == undefined){
                params.filter.$or = [];
            }

            for (var c = 0; c < arr.length; c++) {
                params.filter.$or.push({ DownhillSide: arr[c] });
            }
        }
        return params;
    }

    static ceaTripName(queryString, params) {
        //TripName
        if (queryString.tripName != null) {

            params.filter.TripName = {
                $regex: queryString.tripName,
                $options : 'i'
            };
        }
        return params;
    }

    static ceaUser(queryString, params) {
        //User
        if (queryString.user != null) {
            params.filter.User = queryString.user;
        }
        return params;
    }

    static ceaTarget(queryString, params) {
        //Target
        if (queryString.target != null) {

            arr = queryString.target.split(",");

            if(params.filter.$or == undefined){
                params.filter.$or = [];
            }

            for (var c = 0; c < arr.length; c++) {
                params.filter.$or.push({ Site: arr[c] });
            }
        }
        return params;
    }

    static ceaTripRate(queryString, params) {
        //tripRate
        if (queryString.tripRate != null) {

            var arr = queryString.tripRate.split(",");

            if(params.filter.$or == undefined){
                params.filter.$or = [];
            }

            for (var c = 0; c < arr.length; c++) {
                params.filter.$or.push({ TripRate: arr[c] });
            }
        }
        return params;
    }

    static ceaSnowRate(queryString, params) {
        //snowRate
        if (queryString.snowRate != null) {

            var arr = queryString.snowRate.split(",");

            if(params.filter.$or == undefined){
                params.filter.$or = [];
            }

            for (var c = 0; c < arr.length; c++) {
                params.filter.$or.push({ SnowRate: arr[c] });
            }
        }
        return params;
    }

    static ceaStartingFrom(queryString, params) {
        //startingFrom
        if (queryString.startingFrom != null) {
            //params.filter.StartingFrom = { $regex: ".*" + queryString.startingFrom + ".*", $options : 'i' };
            params.filter.StartingFrom = {
                $regex: queryString.startingFrom,
                $options : 'i'
            };
        }

        return params;

    }
}