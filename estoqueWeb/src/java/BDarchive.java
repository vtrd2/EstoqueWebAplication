



/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
import java.sql.*;
//import java.util.logging.Level;
import java.util.HashMap;
import java.util.Map;
/**
 *
 * @author Vitor
 */
public final class BDarchive {
    private static BDarchive instance;
    public Statement stmt;

    
    private BDarchive(Statement stmtN) {
        stmt = stmtN;
    }
    
    public static BDarchive getBD() {
        if (instance == null) {
            try {
                Class.forName("com.mysql.jdbc.Driver");
                Connection con = DriverManager.getConnection("jdbc:mysql://localhost:3306/estoque?serverTimezone=UTC&autoReconnect=true&useSSL=false", "root", "16112005");
                Statement stmtN = con.createStatement();
                instance = new BDarchive(stmtN);
            } catch (Exception ex) {
                System.out.println(ex);
            }
        }
        
        return instance;
    }
    
    public Map<String, Integer> getProducts() {
        stmt = BDarchive.getBD().stmt;
        
        Map<String, Integer> map = new HashMap<>();
        try {
            ResultSet retorno = stmt.executeQuery("SELECT * FROM Produtos");
            while (retorno.next()) {
                map.put(retorno.getString(2), Integer.parseInt(retorno.getString(3)));
            }

        } catch (SQLException ex) {
            System.out.println("\n!!!Sem produtos cadastrados!!!\n" + ex);
        }
        return map;        
    }
    
    public Map<String, Integer> getProduct(String name) {
        stmt = BDarchive.getBD().stmt;
        
        Map<String, Integer> map = new HashMap<>();
        try {
            
            ResultSet retorno = stmt.executeQuery("SELECT * FROM Produtos WHERE nome = '" + name + "'");
            retorno.next();
            map.put(retorno.getString(2), Integer.parseInt(retorno.getString(3)));
            System.out.println(retorno.getString(2));
            
        } catch (SQLException ex) {
            System.out.println("\n!!!Sem produto cadastrado!!!\n" + ex);
        }
        
        return map;        
    }
    
    public Map<String, Boolean> productExists(String name) {
        Map<String, Boolean> map = new HashMap<>();
        ResultSet retorno;
        
        try {
            retorno = stmt.executeQuery("select * from Produtos where nome = '" + name + "'");
            retorno.next();
            retorno.getString(1);
            
        } catch (SQLException ex) {
            map.put("exists", false);
            return map;
        }
        
        map.put("exists", true);
        return map;
    }
    
    public Map<String, Boolean> saveProduct(String nome, String quantidade) {
        
        Map<String, Boolean> map = new HashMap<>();
        
        if (this.productExists(nome).get("exists")) {
            //Produto ja existente
            try {
                stmt.executeUpdate("UPDATE Produtos SET quantidade = (" + quantidade + ") WHERE nome = '" + nome + "'");
                map.put("saved", true);
            } catch (SQLException ex) {
                map.put("saved", false);
            }
        } else {
            try {
                //Novo produto
                stmt.executeUpdate("INSERT INTO Produtos (nome, quantidade) VALUES ('" + nome + "', " + quantidade + ")");
                map.put("saved", true);
            } catch (SQLException ex) {
                map.put("saved", false);
            }
        }
        
        return map;
    }
    
    public Map<String, Boolean> deleteProduct(String nome) {
        
        Map<String, Boolean> map = new HashMap<>();
        
        if (this.productExists(nome).get("exists")) {
            //Produto ja existente
            try {
                stmt.executeUpdate("delete from Produtos where nome = '" + nome + "'");
                map.put("deleted", true);
            } catch (SQLException ex) {
                map.put("deleted", false);
            }
        } else {
            map.put("deleted", false);
        }
        
        return map;
    }
}