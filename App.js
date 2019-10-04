import React from 'react';
import {
  StyleSheet,
  NativeModules,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import PDFLib, { PDFDocument, PDFPage } from 'react-native-pdf-lib';

let PSPDFKit = NativeModules.PSPDFKit;

const CONFIGURATION = {
  scrollContinuously: false,
  showPageNumberOverlay: true,
  pageScrollDirection: "vertical",
  showShareAction: false,
  showPrintAction: false,
};


async function generatePdfWithPdfLib(state = {}) {
  const page1 = PDFPage
    .create()
    .setMediaBox(200, 300)
    .drawText('PDF test file.', {
      x: 50,
      y: 140,
      color: '#000000',
    });

  const docsDir = await PDFLib.getDocumentsDirectory();
  const pdfPath = `${docsDir}/sample.pdf`;

  PDFDocument
    .create(pdfPath)
    .addPages(page1)
    .write()
    .then(path => {
      console.log('PDF created at: ' + path);
      state.document = path;
    });
}


export default class App extends React.Component<{}> {
  constructor(props) {
    super(props);

    this.state = { document: null };

    this._onOpenPdf = this._onOpenPdf.bind(this);
    this._onGeneratePdf =  this._onGeneratePdf.bind(this);
  }

  _onGeneratePdf(state) {
    generatePdfWithPdfLib(state);
  }

  _onOpenPdf() {
    const { document } = this.state;

    if (!document) {
      return;
    }

    try {
      PSPDFKit.present(document, CONFIGURATION);
    } catch (err) {
      console.warn(err);
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>PSPDFKit {PSPDFKit.versionString}</Text>
        <TouchableOpacity onPress={() => this._onGeneratePdf(this.state)}>
          <Text style={styles.text}>Create Document</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={this._onOpenPdf}>
          <Text style={styles.text}>Open Document</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10
  }
});
