import React from 'react';
import {
  StyleSheet,
  NativeModules,
  Text,
  TouchableOpacity,
  View,
  ToastAndroid
} from 'react-native';

import styled from 'styled-components/native';
import PSPDFKitView from 'react-native-pspdfkit';
import PDFLib, { PDFDocument, PDFPage } from 'react-native-pdf-lib';

let PSPDFKit = NativeModules.PSPDFKit;

const CONFIGURATION = {
  scrollContinuously: false,
  showPageNumberOverlay: true,
  pageScrollDirection: "vertical",
  showShareAction: false,
  showPrintAction: false,
};

const toastShow = (msg) => ToastAndroid && ToastAndroid.show(msg, ToastAndroid.SHORT);


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
      state.document = path;

      toastShow('Document created');
    });
}


export default class App extends React.Component<{}> {
  constructor(props) {
    super(props);

    this.state = {
      document: null,
      documentOpenWithUIView: false
    };

    this.onGeneratePdf =  this.onGeneratePdf.bind(this);
    this.onOpenWithPSPDFKitModule = this.onOpenWithPSPDFKitModule.bind(this);
    this.onOpenWithUIViewer = this.onOpenWithUIViewer.bind(this);
    this.onClosePDFViewer = this.onClosePDFViewer.bind(this);
  }

  onGeneratePdf(state) {
    generatePdfWithPdfLib(state);
  }

  onOpenWithPSPDFKitModule() {
    const { document } = this.state;

    if (!document) {
      toastShow('No document');
      return;
    }

    try {
      PSPDFKit.present(document, CONFIGURATION);
    } catch (err) {
      console.warn(err);
    }
  }

  onOpenWithUIViewer() {
    const { document } = this.state;

    if (!document) {
      toastShow('No document');
      return;
    }

    this.setState({
      ...this.state,
      documentOpenWithUIView: true
    });
  }

  onClosePDFViewer() {
    this.setState({
      ...this.state,
      documentOpenWithUIView: false
    });
  }

  render() {
    const { document, documentOpenWithUIView } = this.state;

    if (document && documentOpenWithUIView) {
      return (
        <PDFViewContainer>
          <PSPDFKitView
            ref="pdfView"
            document={document}
            configuration={CONFIGURATION}
            style={{ flex:1, color: '#1EADD1' }}
            showCloseButton={true}
            onCloseButtonPressed={this.onClosePDFViewer}
          />
        </PDFViewContainer>
      );
    }

    return (
      <View style={styles.container}>
        <Text>PSPDFKit {PSPDFKit.versionString}</Text>
        <TouchableOpacity onPress={() => this.onGeneratePdf(this.state)}>
          <Text style={styles.text}>Create Document</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.onOpenWithPSPDFKitModule}>
          <Text style={styles.text}>Open with PSPDFKit module</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.onOpenWithUIViewer}>
          <Text style={styles.text}>Open with PSPDFKitView</Text>
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

const PDFViewContainer = styled.View`
  flex: 1;
  background: gray;
  padding: 8px;
  position: relative;
`;
