let documentselector = "";
let windowDoc = "";
let divID = "";
let color = "";
let start_gl = "";
let end_gl = "";
export const PostHighlight = (divID, color1, set) => {
  documentselector =
    document?.getElementById("iframeResult")?.contentWindow?.document;
  windowDoc = document?.getElementById("iframeResult")?.contentWindow?.window;
  divID = divID;
  color = color1;
  const { start, end } = reportSelection(divID);
  if (start == end) {
    let selectedText = {
      start: start,
      end: end,
      text: "",
    };
    return selectedText;
  }
  if (set === 1) {
    selectAndHighlightRange(`${divID}`, start, end, color1);
  }

  let selectedText = {
    start: start,
    end: end,
    text: windowDoc?.getSelection()?.toString(),
  };

  return selectedText;
};

function reportSelection(divID) {
  var selOffsets = getSelectionCharacterOffsetWithin(
    documentselector.getElementById(`${divID}`)
  );
  return { start: selOffsets.start, end: selOffsets.end };
}

function getSelectionCharacterOffsetWithin(element) {
  var start = 0;
  var end = 0;
  var doc = element.ownerDocument || element.document;
  var win = doc.defaultView || doc.parentWindow;
  var sel;
  if (typeof win.getSelection != "undefined") {
    sel = win.getSelection();
    if (sel.rangeCount > 0) {
      var range = win.getSelection().getRangeAt(0);
      var preCaretRange = range.cloneRange();
      preCaretRange.selectNodeContents(element);
      preCaretRange.setEnd(range.startContainer, range.startOffset);
      start = preCaretRange.toString().length;
      preCaretRange.setEnd(range.endContainer, range.endOffset);
      end = preCaretRange.toString().length;
    }
  } else if ((sel = doc.selection) && sel.type != "Control") {
    var textRange = sel.createRange();
    var preCaretTextRange = doc.body.createTextRange();
    preCaretTextRange.moveToElementText(element);
    preCaretTextRange.setEndPoint("EndToStart", textRange);
    start = preCaretTextRange.text.length;
    preCaretTextRange.setEndPoint("EndToEnd", textRange);
    end = preCaretTextRange.text.length;
  }
  return { start: start, end: end };
}

export function selectAndHighlightRange(id, start, end, color1, comment) {
  if (start == end) {
    return false;
  }
  start_gl = start;
  end_gl = end;
  documentselector =
    document?.getElementById("iframeResult")?.contentWindow?.document;
  windowDoc = document?.getElementById("iframeResult")?.contentWindow?.window;
  color = color1;
  setSelectionRange(documentselector?.getElementById(id), start, end);
  highlight(color, comment);
}

function getTextNodesIn(node) {
  var textNodes = [];
  if (node.nodeType == 3) {
    textNodes.push(node);
  } else {
    var children = node.childNodes;
    for (var i = 0, len = children.length; i < len; ++i) {
      textNodes.push.apply(textNodes, getTextNodesIn(children[i]));
    }
  }
  return textNodes;
}

function setSelectionRange(el, start, end) {
  if (documentselector?.createRange && windowDoc?.getSelection) {
    var range = documentselector?.createRange();
    range.selectNodeContents(el);
    var textNodes = getTextNodesIn(el);
    var foundStart = false;
    var charCount = 0,
      endCharCount;

    for (var i = 0, textNode; (textNode = textNodes[i++]); ) {
      endCharCount = charCount + textNode.length;
      if (
        !foundStart &&
        start >= charCount &&
        (start < endCharCount ||
          (start == endCharCount && i <= textNodes.length))
      ) {
        range.setStart(textNode, start - charCount);
        foundStart = true;
      }
      if (foundStart && end <= endCharCount) {
        range.setEnd(textNode, end - charCount);
        break;
      }
      charCount = endCharCount;
    }

    var sel = windowDoc?.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  } else if (
    documentselector?.selection &&
    documentselector?.body?.createTextRange
  ) {
    var textRange = documentselector?.body?.createTextRange();
    textRange.moveToElementText(el);
    textRange.collapse(true);
    textRange.moveEnd("character", end);
    textRange.moveStart("character", start);
    textRange.select();
  }
}

function makeEditableAndHighlight(colour, comment) {
  let sel = windowDoc?.getSelection();
  let range;
  if (sel.rangeCount && sel.getRangeAt) {
    range = sel.getRangeAt(0);
  }
  documentselector.designMode = "on";
  if (range) {
    sel.removeAllRanges();
    sel.addRange(range);
  }
  if (!documentselector?.execCommand("HiliteColor", false, colour)) {
    documentselector?.execCommand("BackColor", false, colour);
  }

  documentselector?.execCommand("foreColor", false, "#17202A");

  if (!sel?.extentNode?.parentElement.hasAttribute("onclick")) {
    if (sel && sel?.extentNode) {
      sel.extentNode.parentElement.setAttribute(
        "onclick",
        `getannotationcomment(${start_gl},${end_gl});`
      );
      sel.extentNode.parentElement.parentElement.style.borderRadius = "5px";
      sel.extentNode.parentElement.parentElement.style.padding = "0px 5px";
      sel.extentNode.parentElement.parentElement.style.cursor = "pointer";
      if (comment) {
        sel.extentNode.parentElement.parentElement.style.textDecoration =
          "underline";
      }
    }
  }
  if (!sel?.baseNode.parentElement.hasAttribute("onclick")) {
    if (sel && sel?.baseNode) {
      sel.baseNode.parentElement.setAttribute(
        "onclick",
        `getannotationcomment(${start_gl},${end_gl});`
      );

      sel.baseNode.parentElement.parentElement.style.borderRadius = "5px";
      sel.baseNode.parentElement.parentElement.style.padding = "0px 5px";
      sel.baseNode.parentElement.parentElement.style.cursor = "pointer";
      if (comment) {
        sel.baseNode.parentElement.parentElement.style.textDecoration =
          "underline ";
      }
    }
  }

  documentselector.designMode = "off";
}

function highlight(colour, comment) {
  var range;
  if (windowDoc?.getSelection) {
    try {
      if (!documentselector?.execCommand("BackColor", false, colour)) {
        makeEditableAndHighlight(colour, comment);
      }
    } catch (ex) {
      makeEditableAndHighlight(colour, comment);
    }
  } else if (
    documentselector?.selection &&
    documentselector?.selection?.createRange
  ) {
    range = documentselector?.selection?.createRange();
    range.execCommand("BackColor", false, colour);
    range.execCommand("foreColor", false, "#00000");
  }
}
