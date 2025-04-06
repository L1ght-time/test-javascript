window.ImagesResolver = (function () {
  class ImagesResolver {
    constructor() {}

    async fetchPixabayData(query) {
      const searchParams = {
        key: "8522875-59a2673910903be627161f155", // TODO: relocate to .env
        q: query,
        per_page: 100,
        image_type: "all",
      };

      const params = `?${new URLSearchParams(searchParams)}`;

      const searchButton = document.querySelector(".gallery__button");

      try {
        searchButton.disabled = true;

        //TODO: relocate https://pixabay.com/api/ to .env
        const data = await fetch(`https://pixabay.com/api/${params}`).then(
          (response) => response.json()
        );

        return data?.hits;
      } catch (error) {
        console.error(error);
      } finally {
        searchButton.disabled = false;
      }
    }

    async loadModuleByName(moduleName) {
      try {
        const module = await import(`./${moduleName}.db.js`);

        return module.default || module;
      } catch (error) {
        console.error(error);
        throw new Error("Module id is unknown");
      }
    }

    async loadContentByType(moduleName, query) {
      const obj = {
        local: () => this.loadModuleByName(moduleName),
        pixabay: () => this.fetchPixabayData(query),
      };

      const result = await obj[moduleName]();

      return result;
    }

    async search(query, searchModuleId = "local") {
      const data = await this.loadContentByType(searchModuleId, query);

      if (!data?.length) {
        return {
          query,
          searchModuleId,
          images: [],
        };
      }

      const filteredItems = data.reduce(
        (acc, item) =>
          item.tags.split(/\s*,\s*/).includes(query)
            ? [
                ...acc,
                {
                  id: item.id,
                  url: item.previewURL,
                  tags: item.tags,
                },
              ]
            : acc,
        []
      );

      return {
        query,
        searchModuleId,
        images: filteredItems,
      };
    }
  }

  return ImagesResolver;
})();
