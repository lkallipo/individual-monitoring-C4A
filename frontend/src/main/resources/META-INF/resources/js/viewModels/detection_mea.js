define(['ojs/ojcore', 'knockout', 'setting_properties', 'appController', 'jquery',
    'ojs/ojknockout', 'ojs/ojchart', 'ojs/ojbutton', 'urls','anagraph-measure-view'],
        function (oj, ko, sp, app, $) {

            function detectionMeaViewModel() {
                $(".loader-hover").hide();
                var self = this;           	
            	self.data = null;
            	self.diagramData = new Object();
            	
            	
            	
            	//this method loads data form ajax request before view is loaded
            	self.handleActivated = function(info) {           	    
            	      return new Promise(function(resolve, reject) {
            	    	                     	    	
            	    	  var crId = oj.Router.rootInstance.retrieve()[0];
            	    	  var gesId = oj.Router.rootInstance.retrieve()[1];
            	    	  console.log("user is : " + crId);
            	    	  console.log("ges is : " + gesId);
            	    	 
            	    	  //ojModule waits to build the view until the promise resolves            	    	             	    	              	    	
            	    	  var jqxhr = $.getJSON( DAILY_MEASURES_DATA + "/userInRoleId/" + crId + "/gesId/" + gesId, function(data) {
            	    		  console.log( "success for getting daily measures for user !" );
            	    		  self.data = data;
            	    		  
            	    		  //console.log("recieved jason : " + JSON.stringify(data));
            	    		  
            	    		  //building diagramData from json data
            	    		  var measureIds = [];
            	    		  var measures = [];
            	    		  
            	    		  //getting list of measures (detection variables) from json
            	    		  data.forEach(function(element) {
            	    			  if(measureIds.indexOf(element.detectionVariable.id) == -1){          	    				  
            	    				  measureIds.push(element.detectionVariable.id);
            	    				  var meaObj = new Object();
            	    				  meaObj.detectionVariableId = element.detectionVariable.id;
            	    				  meaObj.measureName = element.detectionVariable.detectionVariableName;
            	    				  measures.push(meaObj);
            	    			  }  
            	    			});
            	    		  
            	    		  //foreach variation measure value, get its id, value and intervalStart
            	    		  measures.forEach(function(mea) {
            	    			  mea.measureValues = [];
            	    			  for(var i = 0; i<data.length; i++){
            	    				  if(data[i].detectionVariable.id == mea.detectionVariableId){
            	    					  var mv = new Object();
            	    					  mv.id = data[i].id;
            	    					  mv.value = data[i].measureValue;
            	    					  mv.intervalStart = data[i].timeInterval.intervalStart;
            	    					  mea.measureValues.push(mv);
            	    				  }
            	    			  }
            	    		  });           	    		 
            	    		              	    		  
            	    		 
            	    		  var months = ["January", "February", "March", "April", "May", "June", "July", "August","September", "October", "November", "December"];
            	    		  
            	    		  
            	    		  //finding out for witch months the data is for 
            	    		  measures.forEach(function(mea) {
            	    			var differentMonthsForMeasure = [];
            	    			for(var i = 0; i< mea.measureValues.length; i++){
            	    				var date = new Date(mea.measureValues[i].intervalStart);
                  	    			
                  	    			if(differentMonthsForMeasure.indexOf((months[date.getMonth()] + " " + date.getFullYear())) == -1){
                  	    				differentMonthsForMeasure.push(months[date.getMonth()] + " " + date.getFullYear());
                  	    			}
                  	    			mea.months = differentMonthsForMeasure;                 	    			
                  	    			mea.measureValues[i].formattedDate = date.getDate() + "-" + (date.getMonth()+1) + "-" + date.getFullYear();
            	    			}
              	    			
              	    		  });
            	    		 
            	    		  
            	              //creating lineSeries with values for each month	    		  
            	    		  measures.forEach(function(mea) {
              	    			mea.lineSeries = []; 
              	    			mea.months.forEach(function(mon) {
              	    				var lineSerie = new Object();
              	    				lineSerie.name = mon;
              	    				lineSerie.items = [];
              	    				//new for nuis
              	    				var avg = Math.round(getRandom(1,100));
              	    				var std = Math.round(getRandom(1,100));
              	    				var best = Math.round(getRandom(1,100));
              	    				var delta = Math.round(getRandom(1,100));
              	    				lineSerie.shortDesc = "Average "+ avg +" \n Standard "+ std +" \n Best " + best +" \n Delta " + delta +"";
              	    				
              	    				//end new
              	    				mea.measureValues.forEach(function(mv) {
              	    					var date = new Date(mv.intervalStart);
              	    					var testMon = months[date.getMonth()] + " " + date.getFullYear();              	    					
              	    					if(testMon == mon){               	    						
              	    						lineSerie.items.push(mv);
              	    					}             						
              	    				});
              	    				mea.lineSeries.push(lineSerie);
              	    				
              	    			});             	    				    			
                	    			
            	    		  });
            	    		  
            	    		  function getRandom(min, max) {
            	    			  return Math.random() * (max - min) + min;
            	    			}
            	    		  
            	    		  //delete unnecessary data
            	    		  measures.forEach(function(mea) {
            	    		  delete mea.measureValues;
            	    		  delete mea.months;
            	    		  });
            	    		  
            	    		  
            	    		  //console.log("measures are now : " + JSON.stringify(measures));
            	    		  
            	    		  //inserting empty dates
            	    		  measures.forEach(function(mea) {
            	    			  mea.lineSeries.forEach(function(ls) {
            	    				  
            	    				  for(var i = 0; i< 30; i++){           	    					  
            	    					  if(ls.items[i] == null || ls.items[i] == undefined){            	    						  
            	    						  var item = new Object();
                    	    				  item.value = null;                    	    				                     	    				                     	    				  
                    	    				  ls.items.splice(i, 0, item);
                    	    				  continue;
            	    					  }
            	    					  var dateStart = new Date(ls.items[i].intervalStart);
            	    					             	    					 
            	    					  if(dateStart.getDate() !== i+1){          	    						  
            	    						  if(dateStart.getDate() == i){
            	    							  //if start date is the same as previous one
            	    							  //do nothing because this time interval ends on the i+1 date           	    							 
            	    						  }
            	    						  else{            	    							 
            	    							  var item = new Object();
	                    	    				  item.value = null;                    	    				                     	    				                     	    				  
	                    	    				  ls.items.splice(i, 0, item);	                    	    				  	                    	    				
            	    						  }
            	    						  
            	    					  }
            	    					 
                    	    			  
                    	    			 
                    	    		  }
            	    			  });	 
            	    		  });
            	    		  
            	    		  
            	    		  
            	    	  
            	    		  //data object for diagrams
            	    		  self.data.dailyMeasures = measures;
            	    		  
            	    		  
            	    		  resolve();
            	    		})
            	    		  .fail(function() {
            	    		    console.log( "error recieving json data from web service" );
            	    		  })
            	      });          	                	        
            	    };             	
            }
            return  new detectionMeaViewModel();
            
        });

