import java.io.IOException;
import org.apache.hadoop.hbase.util.Bytes;
import org.apache.hadoop.hbase.client.HBaseAdmin;
import org.apache.hadoop.hbase.HBaseConfiguration;
import org.apache.hadoop.hbase.HColumnDescriptor;
import org.apache.hadoop.hbase.HTableDescriptor;
import org.apache.hadoop.hbase.client.Admin;
import org.apache.hadoop.hbase.client.Connection;
import org.apache.hadoop.hbase.client.ConnectionFactory;
import org.apache.hadoop.hbase.TableName;
import org.apache.hadoop.conf.Configuration;

public class CreateHbaseTable {

        public void createtable(String name, String[] colfamily)throws Exception {
                Configuration config = HBaseConfiguration.create();
                config.set("hbase.zookeeper.quorum", "hadoop1,hadoop2");
                config.set("hbase.zookeeper.property.clientPort", "2181");
                config.set("hbase.cluster.distributed", "true");
                config.set("zookeeper.znode.parent", "/hbase-unsecure");
                HBaseAdmin admin = new HBaseAdmin(config);
                HTableDescriptor des = new HTableDescriptor(Bytes.toBytes(name));
                for (int i = 0; i < colfamily.length; i++) {
                        des.addFamily(new HColumnDescriptor(colfamily[i]));
                }
                if (admin.tableExists(name)) {
                        System.out.println("Table already exist");
                } else {
                        admin.createTable(des);
                        System.out.println("Table: " + name + " Sucessfully created");
                }
        }

        public static void main(String args[]) throws Exception {
                CreateHbaseTable op = new CreateHbaseTable();
                String tablename = "Acadgild";
                String[] familys = { "Emp_name", "sal" };
                op.createtable(tablename, familys);
        }
}