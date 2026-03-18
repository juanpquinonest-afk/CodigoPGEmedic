import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

// Patrón creacional: Singleton
public class CarRepository {
    private static CarRepository instance;
    private final List<Car> cars = new ArrayList<>();

    private CarRepository() {}

    public static synchronized CarRepository getInstance() {
        if (instance == null) {
            instance = new CarRepository();
        }
        return instance;
    }

    public void add(Car car) {
        cars.add(car);
    }

    public List<Car> findByName(String name) {
        String q = name == null ? "" : name.trim().toLowerCase();
        return cars.stream()
                .filter(c -> c.getName().toLowerCase().contains(q))
                .collect(Collectors.toList());
    }

    public List<Car> findBySeries(String series) {
        String q = series == null ? "" : series.trim().toLowerCase();
        return cars.stream()
                .filter(c -> c.getSeries().toLowerCase().contains(q))
                .collect(Collectors.toList());
    }

    public List<Car> getAll() {
        return new ArrayList<>(cars);
    }
}
