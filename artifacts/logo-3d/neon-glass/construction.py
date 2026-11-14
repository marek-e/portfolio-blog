def build_strokes(design):
    layout = design["layout"]
    top = layout["height"] / 2
    bottom = -top
    spine = layout["spine_x"]
    right = layout["right_x"]
    run = layout["diagonal_run"]
    pitch = layout["diagonal_pitch"]
    dot = right + (layout["stroke_width"] - layout["dot_diameter"]) / 2
    endpoints = {
        "M left": ((spine - pitch - run, bottom), (spine - pitch, top)),
        "M inner": ((spine - run, bottom), (spine, top)),
        "Shared spine": ((spine, bottom), (spine, top)),
        "E top": ((spine, top), (right, top)),
        "E middle": ((dot, 0), (dot, 0)),
        "E bottom": ((spine, bottom), (right, bottom)),
    }
    return [
        {
            **stroke,
            "start": endpoints[stroke["name"]][0],
            "end": endpoints[stroke["name"]][1],
            "width": layout["dot_diameter"] if stroke["name"] == "E middle" else layout["stroke_width"],
        }
        for stroke in design["strokes"]
    ]
