import java.util.List;

// Patrón estructural: Proxy
// Controla el acceso al repositorio real y añade funcionalidad de logging
public class CarRepositoryProxy {
    private final CarRepository realRepository;

    public CarRepositoryProxy(CarRepository repository) {
        this.realRepository = repository;
    }

    public void add(Car car) {
        System.out.println("[PROXY] Agregando auto: " + car.getName());
        realRepository.add(car);
        System.out.println("[PROXY] Auto agregado exitosamente.");
    }

    public List<Car> findByName(String name) {
        System.out.println("[PROXY] Buscando por nombre: " + name);
        List<Car> result = realRepository.findByName(name);
        System.out.println("[PROXY] Se encontraron " + result.size() + " resultado(s).");
        return result;
    }

    public List<Car> findBySeries(String series) {
        System.out.println("[PROXY] Buscando por serie: " + series);
        List<Car> result = realRepository.findBySeries(series);
        System.out.println("[PROXY] Se encontraron " + result.size() + " resultado(s).");
        return result;
    }

    public List<Car> getAll() {
        System.out.println("[PROXY] Obteniendo todos los autos.");
        return realRepository.getAll();
    }
}
