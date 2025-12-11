# python/tests/test_excel.py

import os
from pathlib import Path

from backend.Eksel import generateExcel


def test_create_excel_file_creates_new_file(tmp_path, monkeypatch):
    messages = []

    class DummyMessageBox:
        @staticmethod
        def showinfo(title, message):
            messages.append((title, message))

    monkeypatch.setattr(generateExcel, "messagebox", DummyMessageBox)

    file_path = tmp_path / "DataBase.xlsx"
    generateExcel.create_excel_file(str(file_path))

    assert file_path.exists()
    assert messages, "Expected info message when creating new file"
    assert "created successfully" in messages[0][1].lower()


def test_create_excel_file_does_not_overwrite_existing(tmp_path, monkeypatch):
    messages = []

    class DummyMessageBox:
        @staticmethod
        def showinfo(title, message):
            messages.append((title, message))

    monkeypatch.setattr(generateExcel, "messagebox", DummyMessageBox)

    file_path = tmp_path / "DataBase.xlsx"
    # ustvari prazen file vnaprej
    file_path.write_bytes(b"")

    generateExcel.create_excel_file(str(file_path))

    # file še vedno obstaja
    assert file_path.exists()
    # pričakujemo message "already exists"
    assert messages, "Expected info message when file already exists"
    assert "already exists" in messages[0][1].lower()
