// SELECT FORMAT -- would DB return it or should we parse?
const _ = require('lodash')

const colors = [
    {
        "label": "Red",
        "value": "red",
    },
    {
        "label": "Blue",
        "value": "blue"
    },
    {
        "label": "Green",
        "value": "green"
    },
    {
        "label": "Yellow",
        "value": "yellow"
    },
]
const shapes = [
    {
        "label": "Square",
        "value": "square",
        "parent_name": "red",
    },
    {
        "label": "Circle",
        "value": "circle",
        "parent_name": "blue",
    },
    {
        "label": "Octagon",
        "value": "octagon",
        "parent_name": "green",
    },
    {
        "label": "Triangle",
        "value": "triangle",
        "parent_name": "yellow",
    },
]
const textures = [
    {
        "label": "Soft",
        "value": "soft",
        "parent_name": "square",
    },
    {
        "label": "Hard",
        "value": "hard",
        "parent_name": "square",
    },
    {
        "label": "Rough",
        "value": "rough",
        "parent_name": "circle",
    },
    {
        "label": "Smooth",
        "value": "smooth",
        "parent_name": "triangle",
    },
    {
        "label": "Plush",
        "value": "plush",
        "parent_name": "octagon",
    },
]

// TODO: map of how these relate to each other

const filterBy = (arr, key, value) => arr.filter((x) => _.toLower(_.get(x, key,'')) === _.toLower(value))

module.exports = (args = {}, query, session) => {
    console.log({
        args,
        query,
        session,
    })

    const { color, shape } = args

    if (color) {
        const _shapes = filterBy(shapes, 'parent_name', color)
        return JSON.stringify(_shapes)
    }

    if (shape) {
        const _textures = filterBy(textures, 'parent_name', shape)
        return JSON.stringify(_textures)
    }

    return JSON.stringify(colors);
}
