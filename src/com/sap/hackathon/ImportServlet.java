package com.sap.hackathon;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class ImportServlet extends HttpServlet {

	/**
	 * 
	 */
	private static final long serialVersionUID = 2499256480428541237L;

	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		new Thread(){
			public void run() {
				/*curl -XPOST 'localhost:9200/test/type1/1/_update' -d '{
			    "doc" : {
			        "name" : "new_name"
			    }
			}'*/
//				String url = "http://10.58.9.51:9200/hackathon-team3/"+id+"/_update";
//				String content = "{\"doc\""
			}
		}.start();
	}
}
