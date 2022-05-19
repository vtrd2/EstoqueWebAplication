
import java.util.HashMap;
import java.util.Map;

/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */

/**
 *
 * @author VITORHERBSTRITH
 */
public class Produto { 
    //public int idVal;
    public String nome;
    public int quantidade;
    
    public Map<String, String> getValues() {
        Map<String, String> map = new HashMap<>();
        map.put("nome", nome);
        map.put("quantidade", Integer.toString(quantidade));
        return map;
    }
}
