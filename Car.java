public class Car {
    private final int id;
    private final String name;
    private final String series;
    private static int nextId = 1;

    public Car(String name, String series) {
        this.id = nextId++;
        this.name = name;
        this.series = series;
    }

    public int getId() { return id; }
    public String getName() { return name; }
    public String getSeries() { return series; }

    @Override
    public String toString() {
        return "Car{id=" + id + ", name='" + name + "', series='" + series + "'}";
    }
}
