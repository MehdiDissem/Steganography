import PyPDF2

# Open the carrier PDF file and the secret PDF file
carrier_file = 'ex1.pdf'
secret_file = 'ex2.pdf'

with open(carrier_file, 'rb') as carrier_pdf, open(secret_file, 'rb') as secret_pdf:
    carrier_reader = PyPDF2.PdfReader(carrier_pdf)
    secret_reader = PyPDF2.PdfReader(secret_pdf)

    # Create a new PDF writer
    output_pdf = PyPDF2.PdfWriter()

    # Add the pages from the carrier PDF to the output PDF
    for page in carrier_reader.pages:
        output_pdf.addPage(page)

    # Add the pages from the secret PDF to the output PDF
    for page in secret_reader.pages:
        output_pdf.addPage(page)

    # Save the modified PDF to a new file
    output_file = 'ex3.pdf'
    with open(output_file, 'wb') as output:
        output_pdf.write(output)

print(f"The modified PDF file with the hidden slide is saved as {output_file}.")
