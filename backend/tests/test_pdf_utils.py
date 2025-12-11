# python/tests/test_pdf_utils.py

from backend.pdfReadPlumber import remove_word_plane, clean_cell, remove_signs


def test_remove_word_plane_removes_word_plane_only():
    table = [
        ["Sagittal Plane", "Frontal Plane"],
        ["No Plane here", "Just text"]
    ]

    result = remove_word_plane(table)

    # Verify first row
    assert result[0][0] == "Sagittal"
    assert result[0][1] == "Frontal"

    # Normalize whitespace for comparison
    normalized = " ".join(result[1][0].split())
    assert normalized in ["No here", "No"]


def test_clean_cell_removes_parentheses_content():
    cell = "Value (something) more"
    cleaned = clean_cell(cell)
    assert "(" not in cleaned
    assert "something" not in cleaned
    assert cleaned.strip().startswith("Value")


def test_clean_cell_returns_none_for_none():
    assert clean_cell(None) is None


def test_remove_signs_removes_percent_degree_mm():
    cell = "10% 20° 30 mm"
    result = remove_signs(cell)
    assert "%" not in result
    assert "°" not in result
    assert "mm" not in result
    # številke naj ostanejo
    for num in ["10", "20", "30"]:
        assert num in result


def test_remove_signs_returns_none_for_none():
    assert remove_signs(None) is None
