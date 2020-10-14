// adapted from schollz/rwtxt
function slugify(text) {
    let lines = text.split('\n');

    for (let i = 0; i < lines.length; i++) {
        const slug = lines[i].toString().toLowerCase()
            .replace(/\s+/g, '-') // Replace spaces with -
            .replace(/[^\w\-]+/g, '') // Remove all non-word chars
            .replace(/\-\-+/g, '-') // Replace multiple - with single -
            .replace(/^-+/, '') // Trim - from start of text
            .replace(/-+$/, '') // Trim - from end of text
        ;

        if (slug.length > 1)
            return slug;
    }

    return '';
}

module.exports = slugify;