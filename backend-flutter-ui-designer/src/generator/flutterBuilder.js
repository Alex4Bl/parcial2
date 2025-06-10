const fs = require('fs-extra');
const path = require('path');

const generateFlutterProject = async (views, outputPath) => {
  const libDir = path.join(outputPath, 'lib');
  await fs.ensureDir(libDir);

  const viewImports = [];
  const viewRoutes = [];

  for (const view of views) {
    const fileName = `${view.name}.dart`;
    const className = capitalize(view.name);
    const filePath = path.join(libDir, fileName);

    viewImports.push(`import '${fileName}';`);
    viewRoutes.push(`'${view.name}': (context) => ${className}(),`);

    const back = getPrevious(views, view.name);
    const next = getNext(views, view.name);

    const code = buildViewCode(className, view.name, back, next, view.components || []);
    await fs.writeFile(filePath, code);
  }

  const mainContent = buildMain(viewImports, viewRoutes);
  await fs.writeFile(path.join(libDir, 'main.dart'), mainContent);

  const pubspec = buildPubspec();
  await fs.writeFile(path.join(outputPath, 'pubspec.yaml'), pubspec);
};

const buildMain = (imports, routes) => `
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

${imports.join('\n')}

void main() => runApp(MyApp());

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter UI Builder',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        useMaterial3: true,
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.indigo),
        textTheme: GoogleFonts.poppinsTextTheme(),
      ),
      initialRoute: '${routes[0].split("'")[1]}',
      routes: {
        ${routes.join('\n        ')}
      },
    );
  }
}
`;

const buildViewCode = (className, routeName, back, forward, components = []) => {
  const widgetList = components.map(generateComponentCode).join(',\n');
  return `
import 'package:flutter/material.dart';

class ${className} extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('${routeName}')),
      body: SingleChildScrollView(
        child: Padding(
          padding: EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              ${widgetList}
            ],
          ),
        ),
      ),
      bottomNavigationBar: BottomAppBar(
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            ${back ? `TextButton(onPressed: () => Navigator.pop(context), child: Text("Atrás")),` : 'SizedBox(),'}
            ${forward ? `TextButton(onPressed: () => Navigator.pushNamed(context, '${forward}'), child: Text("Siguiente")),` : 'SizedBox()'}
          ],
        ),
      ),
    );
  }
}
`;
};

const buildPubspec = () => `
name: flutter_generated_app
description: Proyecto generado automáticamente
version: 1.0.0+1

environment:
  sdk: ">=3.0.0 <4.0.0"

dependencies:
  flutter:
    sdk: flutter
  google_fonts: ^6.2.1

flutter:
  uses-material-design: true
`;

const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const getPrevious = (list, name) => {
  const i = list.findIndex(v => v.name === name);
  return i > 0 ? list[i - 1].name : null;
};
const getNext = (list, name) => {
  const i = list.findIndex(v => v.name === name);
  return i < list.length - 1 ? list[i + 1].name : null;
};

function generateComponentCode(component) {
  const { type, properties = {} } = component;

  switch (type) {
    case 'text':
      return `Text(
        '${properties.text || ''}',
        style: TextStyle(
          fontSize: ${properties.fontSize || 16},
          color: ${convertColor(properties.color) || 'Colors.black'},
        ),
      )`;

    case 'button':
      return `ElevatedButton(
        onPressed: () {},
        style: ElevatedButton.styleFrom(
          backgroundColor: ${convertColor(properties.backgroundColor) || 'Colors.indigo'},
          foregroundColor: ${convertColor(properties.color) || 'Colors.white'},
        ),
        child: Text('${properties.text || 'Botón'}'),
      )`;

    case 'checkbox':
      return `CheckboxListTile(
        value: ${properties.checked || false},
        onChanged: (_) {},
        title: Text('${properties.text || ''}'),
        controlAffinity: ListTileControlAffinity.leading,
      )`;

    case 'edittext':
      return `TextField(
        decoration: InputDecoration(
          hintText: '${properties.placeholder || ''}',
          filled: true,
          fillColor: ${convertColor(properties.backgroundColor) || 'Colors.white'},
          border: OutlineInputBorder(
            borderSide: BorderSide(color: ${convertColor(properties.borderColor) || 'Colors.grey'}),
          ),
        ),
        style: TextStyle(
          fontSize: ${properties.fontSize || 14},
          color: ${convertColor(properties.textColor) || 'Colors.black'},
        ),
      )`;

    case 'listbox':
      return `DropdownButton<String>(
        value: '${properties.items?.[0] || 'Item 1'}',
        items: ${JSON.stringify(properties.items || ['Item 1'])}.map((item) =>
          DropdownMenuItem(value: item, child: Text(item))).toList(),
        onChanged: (_) {},
      )`;

    case 'table':
      return `Table(
        border: TableBorder.all(),
        children: List.generate(${properties.rows || 2}, (_) =>
          TableRow(
            children: List.generate(${properties.columns || 2}, (_) =>
              Padding(
                padding: EdgeInsets.all(4),
                child: Text("Celda", style: TextStyle(fontSize: ${properties.fontSize || 12})),
              )
            )
          )
        ),
      )`;

    case 'image':
      return `Container(
        width: ${component.width || 100},
        height: ${component.height || 100},
        color: ${convertColor(properties.backgroundColor) || 'Colors.grey'},
        child: Icon(Icons.image, size: 48),
      )`;

    case 'ellipse':
      return `Container(
        width: ${component.width || 100},
        height: ${component.height || 100},
        decoration: BoxDecoration(
          shape: BoxShape.circle,
          color: ${convertColor(properties.backgroundColor) || 'Colors.blue'},
          border: Border.all(
            color: ${convertColor(properties.borderColor) || 'Colors.black'},
            width: ${properties.borderWidth || 2},
          ),
        ),
      )`;

    case 'container':
      return `Container(
        width: ${component.width || 100},
        height: ${component.height || 100},
        padding: EdgeInsets.all(8),
        decoration: BoxDecoration(
          color: ${convertColor(properties.backgroundColor) || 'Colors.transparent'},
        ),
        child: Text("Contenedor"),
      )`;

    default:
      return `Container(child: Text("Tipo ${type} no implementado"))`;
  }
}

function convertColor(color) {
  if (!color || color === 'transparent') return null;
  return `Color(0xFF${color.replace('#', '')})`;
}

module.exports = { generateFlutterProject };
