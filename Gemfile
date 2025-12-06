source "https://rubygems.org"

# GitHub Pages gem includes Jekyll and all compatible plugins
gem "github-pages", "~> 231", group: :jekyll_plugins

# Additional plugins for enhanced functionality
group :jekyll_plugins do
  gem "jekyll-feed", "~> 0.17"
  gem "jekyll-seo-tag", "~> 2.8"
  gem "jekyll-sitemap", "~> 1.4"
end

# Windows and JRuby support
platforms :mingw, :x64_mingw, :mswin, :jruby do
  gem "tzinfo", ">= 1", "< 3"
  gem "tzinfo-data"
end

# Performance optimization
gem "wdm", "~> 0.1.1", :platforms => [:mingw, :x64_mingw, :mswin]
