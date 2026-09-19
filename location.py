from math import radians, sin, cos, sqrt, atan2


def calculate_distance(lat1, lon1, lat2, lon2):
    earth_radius = 6371000

    lat1 = radians(lat1)
    lat2 = radians(lat2)

    difference_lat = radians(lat2 - lat1)
    difference_lon = radians(lon2 - lon1)

    a = (
        sin(difference_lat / 2) ** 2
        + cos(lat1) * cos(lat2) * sin(difference_lon / 2) ** 2
    )

    c = 2 * atan2(sqrt(a), sqrt(1 - a))

    distance = earth_radius * c

    return distance
distance = calculate_distance(
    12.3456,
    76.7890,
    12.3460,
    76.7895
)

print(f"Distance: {distance:.2f} meters")    