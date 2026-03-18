import java.util.List;
import java.util.Scanner;

public class ProgramCar {

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Patrón creacional: Singleton
        CarRepository repo = CarRepository.getInstance();
        // Patrón estructural: Proxy
        CarRepositoryProxy proxy = new CarRepositoryProxy(repo);

        boolean running = true;
        while (running) {
            System.out.println("\n--- Registro de Autos ---");
            System.out.println("1) Registrar auto");
            System.out.println("2) Buscar por nombre");
            System.out.println("3) Buscar por serie");
            System.out.println("4) Listar todos");
            System.out.println("5) Salir");
            System.out.print("Elige opción: ");
            String opt = sc.nextLine().trim();

            switch (opt) {
                case "1":
                    System.out.print("Nombre del auto: ");
                    String name = sc.nextLine().trim();
                    System.out.print("Serie del vehículo: ");
                    String series = sc.nextLine().trim();
                    Car created = new Car(name, series);
                    proxy.add(created);
                    System.out.println("Registrado: " + created);
                    break;
                case "2":
                    System.out.print("Nombre a buscar: ");
                    String qname = sc.nextLine().trim();
                    List<Car> byName = proxy.findByName(qname);
                    byName.forEach(System.out::println);
                    if (byName.isEmpty()) System.out.println("No se encontró ninguno.");
                    break;
                case "3":
                    System.out.print("Serie a buscar: ");
                    String qseries = sc.nextLine().trim();
                    List<Car> bySeries = proxy.findBySeries(qseries);
                    bySeries.forEach(System.out::println);
                    if (bySeries.isEmpty()) System.out.println("No se encontró ninguno.");
                    break;
                case "4":
                    List<Car> all = proxy.getAll();
                    all.forEach(System.out::println);
                    if (all.isEmpty()) System.out.println("No hay autos registrados.");
                    break;
                case "5":
                    running = false;
                    break;
                default:
                    System.out.println("Opción inválida.");
            }
        }

        sc.close();
        System.out.println("Programa terminado.");
    }
}
