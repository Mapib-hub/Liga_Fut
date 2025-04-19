#!/bin/sh
# wait-for-mongo.sh

# Configura el host y puerto a esperar
host="mongo"
port="27017"

echo "Waiting for mongo at $host:$port..."

# Bucle: mientras 'nc' no pueda conectarse (-z comprueba sin enviar datos) al host y puerto...
while ! nc -z "$host" "$port"; do
  # Espera 1 segundo antes de reintentar
  sleep 1
done

echo "Mongo is up - executing command"

# Ejecuta el comando original que se pasó como argumento a este script
# (En nuestro caso, será "node src/index.js")
exec "$@"
