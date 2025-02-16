IMAGE_NAME = which-movie-api
IMAGE_TAG = latest
CONTAINER_NAME = which-movie-api
PORT = 8080

build:
	docker build --no-cache -t $(IMAGE_NAME):$(IMAGE_TAG) .

push:
	docker push $(IMAGE_NAME):$(IMAGE_TAG)

run:
	docker run -d \
		--name $(CONTAINER_NAME) \
		-p $(PORT):$(PORT) \
		$(IMAGE_NAME):$(IMAGE_TAG)

stop:
	docker stop $(CONTAINER_NAME)
	docker rm $(CONTAINER_NAME)

restart: stop run

logs:
	docker logs -f $(CONTAINER_NAME)

shell:
	docker exec -it $(CONTAINER_NAME) /bin/bash

dev-install:
	poetry install

dev-run:
	poetry run uvicorn main:app --host localhost --port $(PORT) --reload

clean:
	docker system prune -f

.PHONY: build run stop restart logs shell dev-install dev-run clean test-local test-dev