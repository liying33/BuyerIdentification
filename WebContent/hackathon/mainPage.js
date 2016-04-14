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
		inset: false,
		growing: true
	});
	
	
	var oButton1 = new sap.m.Button({
		text : "Add Condition",
		style: sap.m.ButtonType.Emphasized,
		press: addOneCondition
	});
	
	oButton1.addStyleClass("addButton");
	
	var oButton2 = new sap.m.Button({
		text : "Submit",
		style: sap.m.ButtonType.Emphasized,
	});
	
	function addOneCondition() 
	{
		var oLayout1 = new sap.ui.commons.layout.MatrixLayout({
			layoutFixed : true,
			columns : 3,
			width : "100%",
			widths : [ "40%", "40%", "20%" ]
		});
		
		var oSelect1 = new sap.m.Select({
			name : "select-property",
			items :  new sap.ui.core.Item({
				text : "Select property"
			}),
		});
		oSelect1.addStyleClass("selectProperty");
		
		var oSelect2 = new sap.m.Select({
			name : "select-criteria",
			items :  [new sap.ui.core.Item({
				text : "="
			}),new sap.ui.core.Item({
				text : "starts with"
			}),new sap.ui.core.Item({
				text : "ends with"
			}),,new sap.ui.core.Item({
				text : "contains"
			})]
		});
		
		oSelect2.addStyleClass("selectProperty");
		
		oLayout1.createRow(oSelect1,oSelect2,new sap.m.Input({type: sap.m.InputType.Text, value: "Value"}));
		
		var oCustomItem = new sap.m.CustomListItem({
		    content: oLayout1
		});
		oList.addItem(oCustomItem);
		}
	
	var panel1 = new sap.m.Panel({
		width : "auto",
		headerToolbar : new sap.m.Toolbar( {
			active : true,
			content : new sap.m.Label({
				text : "Combined Search"
			})
		}),
		content :  [oList, oButton1, oButton2]
	});
	panel1.addStyleClass("panel");
	
	var oButton3 = new sap.m.Button({
		text : "Submit",
		style: sap.m.ButtonType.Emphasized,
	});
	
	var panel2 = new sap.m.Panel({
		width : "auto",
		headerToolbar : new sap.m.Toolbar({
			height: "3rem",
			active : true,
			content : new sap.m.Label({
				text : "Fuzzy Search"
			})
		}),
		content :  [new sap.m.Input({type: sap.m.InputType.Text, value: "Input String", width: "50%"}),oButton3]
	});
	panel2.addStyleClass("panel");
	
	var oTable = new sap.m.Table("table1",{
		inset : false,
		columns:[new sap.m.Column({
			header : new sap.m.Label({
				text : "ID"
			})
		}),new sap.m.Column({
			header : new sap.m.Label({
				text : "Name"
			})
		}),new sap.m.Column({
			header : new sap.m.Label({
				text : "Email"
			})
		}),new sap.m.Column({
			header : new sap.m.Label({
				text : "Phone"
			})
		})]
		});
	
	var panel3 = new sap.m.Panel({
		width : "auto",
		headerToolbar : new sap.m.Toolbar({
			height: "3rem",
			active : true,
			content : new sap.m.Label({
				text : "Result"
			})
		}),
		content :  [new sap.m.Label("labelId", {
			text : "Execution Time: "
		}),oTable]
	});
	appStartPage.addContent(panel1).addContent(panel2).addContent(panel3);

	app.addPage(appStartPage);
	app.placeAt("content");