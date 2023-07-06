import PyPDF2
import io


def hide_text_in_pdf(pdf_path, text):
    with open(pdf_path, 'rb') as file:
        pdf_reader = PyPDF2.PdfFileReader(file)
        pdf_writer = PyPDF2.PdfFileWriter()

        for page in pdf_reader.pages:
            content = page.getContents()
            if isinstance(content, PyPDF2.generic.ArrayObject):
                content = content.getObject()
            if isinstance(content, PyPDF2.generic.ByteStringObject):
                stream_data = content.getData()
                modified_data = insert_text_in_stream(stream_data, text)
                page.__setitem__(PyPDF2.generic.NameObject(
                    '/Contents'), modified_data)
            pdf_writer.addPage(page)

        with open('output.pdf', 'wb') as output_file:
            pdf_writer.write(output_file)


def insert_text_in_stream(stream_data, text):
    stream = io.BytesIO(stream_data)
    modified_stream = io.BytesIO()

    for line in stream:
        line = line.decode().strip()
        if line.startswith('BT'):
            line += f"\n/F1 12 Tf\n( {text} ) Tj"
        modified_stream.write(line.encode() + b'\n')

    return PyPDF2.generic.ByteStringObject(modified_stream.getvalue())


def retrieve_text_from_pdf(pdf_path):
    with open(pdf_path, 'rb') as file:
        pdf_reader = PyPDF2.PdfFileReader(file)
        text = ''

        for page in pdf_reader.pages:
            content = page.getContents()
            if isinstance(content, PyPDF2.generic.ArrayObject):
                content = content.getObject()
            if isinstance(content, PyPDF2.generic.ByteStringObject):
                stream_data = content.getData()
                extracted_text = extract_text_from_stream(stream_data)
                text += extracted_text

        return text


def extract_text_from_stream(stream_data):
    stream = io.BytesIO(stream_data)
    text = ''

    for line in stream:
        line = line.decode().strip()
        if line.startswith('(') and line.endswith(')'):
            text += line[1:-1]

    return text


# Usage example
pdf_path = 'C:\\Users\\mehdi\\Desktop\\invisible\\PDFinvisible\\Demission.pdf'
secret_message = "This is a hidden message!"

hide_text_in_pdf(pdf_path, secret_message)
retrieved_message = retrieve_text_from_pdf(
    'C:\\Users\\mehdi\\Desktop\\invisible\\PDFinvisible\\output.pdf')

print(f"Retrieved message: {retrieved_message}")
