/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */

import java.io.IOException;
import java.io.PrintWriter;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.json.JSONObject;

/**
 *
 * @author VITORHERBSTRITH
 */
@WebServlet(urlPatterns = {"/deleteproduct"})
public class deleteProduct extends HttpServlet {
    
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        
        String produto = request.getParameter("nome");
        BDarchive db = BDarchive.getBD();
        JSONObject json = new JSONObject(db.deleteProduct(produto));
        response.getOutputStream().println(json + "");
    }

}
