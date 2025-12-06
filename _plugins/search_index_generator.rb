# Search Index Generator
# Generates a JSON file containing searchable content from all pages

module Jekyll
  class SearchIndexGenerator < Generator
    safe true
    priority :lowest

    def generate(site)
      search_index = site.pages.map do |page|
        {
          title: page.data['title'] || page.name,
          url: page.url,
          content: page.content.gsub(/<[^>]*>/, '').strip[0..500] # Strip HTML and limit content
        }
      end.select { |page| page[:title].to_s.length > 0 }

      # Write search index to JSON file
      File.open(File.join(site.dest, 'assets', 'search-index.json'), 'w') do |f|
        f.write(JSON.generate(search_index))
      end

      # Ensure assets directory exists
      FileUtils.mkdir_p(File.join(site.dest, 'assets'))
    end
  end
end
