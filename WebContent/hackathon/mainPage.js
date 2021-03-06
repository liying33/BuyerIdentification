var app = new sap.m.App("TargetYourCustomer");
// main page
var appStartPage = new sap.m.Page("startPage", {
	title : "Target Your Customer",
});
var Bar = new sap.m.Bar({
	contentLeft : [],
	contentMiddle : [ new sap.m.Label('BarTitle', {
		text : "Target Your Customer",
	}) ],
	contentRight : []
});
appStartPage.setCustomHeader(Bar);

var oList = new sap.m.List({
	inset : false,
	growing : true
});

var oButton1 = new sap.m.Button({
	// text : "Add Condition",
	style : sap.m.ButtonType.Emphasized,
	press : addOneCondition,
	icon : "sap-icon://add"
});

oButton1.addStyleClass("addButton");

var oButton2 = new sap.m.Button({
	text : "Submit",
	style : sap.m.ButtonType.Emphasized,
	press : sendCombinedQuery
});

oButton2.addStyleClass("addButton");

var oButton3 = new sap.m.Button({
	text : "Import",
	style : sap.m.ButtonType.Emphasized,
	press : importData
});

function importData() {
	propertyModel.setData([{
		propertyName : "EMAIL"
	}, {
		propertyName : "MOBILENUMBER"
	}, {
		propertyName : "FIRSTNAME"
	}, {
		propertyName : "LASTNAME"
	}, {
		propertyName : "ADDRESS"
	}, {
		propertyName : "POSTCODE"
	}, {
		propertyName : "AGEGROUP"
	}, {
		propertyName : "GENDER"
	}, {
		propertyName : "INCOMINGGROUP"
	}, {
		propertyName : "HOUSEOWNER"
	}, {
		propertyName : "PROFESSION"
	}, {
		propertyName : "COLLEAGEDEGREE"
	}, {
		propertyName : "MARRAGESTATUS"
	}, {
		propertyName : "HASCHILDREN"
	}, {
		propertyName : "DEAL_SEEKER"
	}, {
		propertyName : "APPLE_FAN"
	}, {
		propertyName : "OVERSEA_BUYER"
	}, {
		propertyName : "PREFEREDBRAND"
	}, {
		propertyName : "PAYMENTTYPE"
	}, {
		propertyName : "FAVIOURATE_CATEGORY"
	}, {
		propertyName : "FREQUENCETOBUY"
	}, {
		propertyName : "AVERAGESPEND"
	}, {
		propertyName : "WECHATID"
	} ]);
}

function addOneCondition() {
	var oLayout1 = new sap.ui.commons.layout.MatrixLayout({
		layoutFixed : true,
		columns : 3,
		width : "100%",
		widths : [ "40%", "40%", "20%" ]
	});

	var oSelect1 = new sap.m.Select({
		name : "select-property"
	});

	var oItemSelectTemplate = new sap.ui.core.Item({
		text : "{propertyName}"
	});
	oSelect1.setModel(propertyModel);
	oSelect1.bindItems("/", oItemSelectTemplate);

	oSelect1.addStyleClass("selectProperty");

	var oSelect2 = new sap.m.Select({
		name : "select-criteria",
		items : [ new sap.ui.core.Item({
			text : "equals"
		}), new sap.ui.core.Item({
			text : "starts with"
		}), new sap.ui.core.Item({
			text : "ends with"
		}), new sap.ui.core.Item({
			text : "contains"
		}), new sap.ui.core.Item({
			text : "fuzzy"
		}), new sap.ui.core.Item({
			text : "missing"
		}) ]
	});

	oSelect2.addStyleClass("selectProperty");

	oLayout1.createRow(oSelect1, oSelect2, new sap.m.Input({
		type : sap.m.InputType.Text,
		value : ""
	}));

	var oCustomItem = new sap.m.CustomListItem({
		content : oLayout1
	});
	oList.addItem(oCustomItem);
}


function sendCombinedQuery() {
	var query = {
		query : {
			bool : {
				must : []
			}
		}
	};

	var items = oList.getItems();
	var hasNormalQuery = false;
	var normalQueryString = "";
	for (var i = 0; i < items.length; i++) {
		var propertyName = oList.getItems()[i].getContent()[0].getRows()[0]
				.getCells()[0].getContent()[0].getSelectedItem().getText();
		var criteria = oList.getItems()[i].getContent()[0].getRows()[0]
				.getCells()[1].getContent()[0].getSelectedItem().getText();
		var value = oList.getItems()[i].getContent()[0].getRows()[0].getCells()[2]
				.getContent()[0]._lastValue;

		if (criteria == "fuzzy") {
			var fuzzy = {};
			fuzzy[propertyName] = value;
			query.query.bool.must.push({
				fuzzy : fuzzy
			});
		} else {
			hasNormalQuery = true;
			var parsevalue = value;
			if(criteria == "missing") {
				parsevalue = "_missing_:" + propertyName;
			} else if (criteria == "starts with") {
				parsevalue = propertyName + ":" + parsevalue + "*";
			} else if (criteria == "ends with") {
				parsevalue = propertyName + ":*" + parsevalue;
			} else if (criteria == "contains") {
				parsevalue = propertyName + ":*" + parsevalue + "*";
			} else {
				parsevalue = propertyName + ".raw:\"" + parsevalue + "\"";
			}
			normalQueryString = normalQueryString + parsevalue + " AND ";

		}
	}
	if (hasNormalQuery) {
		query.query.bool.must.push({
			query_string : {
				query : normalQueryString.substring(0,
						normalQueryString.length - 5)
			}
		});
	}
	
	$.ajax({
		url:"http://10.58.9.51/_search?size=10",
		data:JSON.stringify(query),
		type:'POST',
		crossDomain:true,
		success: function(data){
			resultModel.setData(data);
			sap.m.MessageToast.show("Get response successfully")
		},
		error: function(ex){
			alert("encounter error");
		}
	});
	//sap.m.MessageToast.show(JSON.stringify(query));

}

var panel1 = new sap.m.Panel({
	width : "auto",
	headerToolbar : new sap.m.Toolbar({
		active : true,
		content : new sap.m.Label({
			text : "Combined Search"
		})
	}),
	content : [ oList, oButton1, oButton2, oButton3 ]
});
panel1.addStyleClass("panel");

var oInputString = new sap.m.Input({
	type : sap.m.InputType.Text,
	value : "",
	width : "50%"
});
var oButton3 = new sap.m.Button({
	text : "Submit",
	style : sap.m.ButtonType.Emphasized,
	press : sendEnterpriseSearchQuery
});

function sendEnterpriseSearchQuery() {
	var query = {
		query : {
			query_string : {
				query : oInputString.getValue()
			}
		}
	};
	$.ajax({
		url:"http://10.58.9.51/_search?size=10",
		data:JSON.stringify(query),
		type:'POST',
		crossDomain:true,
		success: function(data){
			resultModel.setData(data);
			sap.m.MessageToast.show("Get response successfully")
		},
		error: function(ex){
			alert("encounter error");
		}
	});
	//sap.m.MessageToast.show(oInputString.getValue());
}

var panel2 = new sap.m.Panel({
	width : "auto",
	headerToolbar : new sap.m.Toolbar({
		height : "3rem",
		active : true,
		content : new sap.m.Label({
			text : "Enterprise Search"
		})
	}),
	content : [ oInputString, oButton3 ]
});
panel2.addStyleClass("panel");

var oTable = new sap.m.Table("table1", {
	inset : false,
	columns : [ new sap.m.Column({
		header : new sap.m.Label({
			text : "ID"
		})
	}), new sap.m.Column({
		header : new sap.m.Label({
			text : "First Name"
		})
	}), new sap.m.Column({
		header : new sap.m.Label({
			text : "Last Name"
		})
	}), new sap.m.Column({
		header : new sap.m.Label({
			text : "Email"
		})
	}), new sap.m.Column({
		header : new sap.m.Label({
			text : "Mobile Number"
		})
	}), new sap.m.Column({
		header : new sap.m.Label({
			text : "Address"
		})
	}), new sap.m.Column({
		header : new sap.m.Label({
			text : "score"
		})
	}) ]
});

var oTemplate = new sap.m.ColumnListItem({
	cells : [ new sap.m.Text({
		text : "{_source/ID}",
		wrapping : false
	}), new sap.m.Text({
		text : "{_source/FIRSTNAME}",
		wrapping : false
	}), new sap.m.Text({
		text : "{_source/LASTNAME}",
		wrapping : false
	}) ,new sap.m.Text({
		text : "{_source/EMAIL}",
		wrapping : false
	}) ,new sap.m.Text({
		text : "{_source/MOBILENUMBER}",
		wrapping : false
	}),new sap.m.Text({
		text : "{_source/ADDRESS}",
		wrapping : false
	}),new sap.m.Text({
		text : "{_score}",
		wrapping : false
	}) ]
});

var resultModel = new sap.ui.model.json.JSONModel();
sap.ui.getCore().setModel(resultModel);

oTable.setModel(resultModel);
oTable.bindItems("/hits/hits", oTemplate);

var oLabelTime = new sap.m.Label("labelTime",{
	text:"{/took}"
});

oLabelTime.setModel(resultModel);

var panel3 = new sap.m.Panel({
	width : "auto",
	headerToolbar : new sap.m.Toolbar({
		height : "3rem",
		active : true,
		content : new sap.m.Label({
			text : "Result"
		})
	}),
	content : [ new sap.m.Label("labelId", {
		text : "Execution Time: "
	}), oLabelTime, new sap.m.Label({
		text:"ms"
	}),oTable ]
});




appStartPage.addContent(panel1).addContent(panel2).addContent(panel3);

app.addPage(appStartPage);
app.placeAt("content");