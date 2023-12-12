'use strict';
module.exports = function localize_zh(errors) {
  if (!(errors && errors.length)) return;
  for (var i = 0; i < errors.length; i++) {
    var e = errors[i];
    var out;
    switch (e.keyword) {
      case '$ref':
        out = 'Không thể tìm thấy tài liệu tham khảo' + (e.params.ref);
        break;
      case 'additionalItems':
        out = '';
        var n = e.params.limit;
        out += 'Không được phép nhiều hơn' + (n) + 'phần tử';
        break;
      case 'additionalProperties':
        out = 'Không cho phép thuộc tính bên ngoài';
        break;
      case 'anyOf':
        out = 'Dữ liệu phải là một trong những dữ liệu được chỉ định bởi AnyOf';
        break;
      case 'const':
        out = 'Phải bằng hằng số';
        break;
      case 'contains':
        out = 'Nên chứa một mục hợp lệ';
        break;
      case 'custom':
        out = 'Nên thông qua xác minh từ khóa' + (e.keyword);
        break;
      case 'dependencies':
        out = '';
        var n = e.params.depsCount;
        out += 'Nên có thuộc tính phụ thuộc cho thuộc tính ' + (e.params.property) + ":" + (e.params.deps);
        break;
      case 'enum':
        out = 'Phải là một trong những giá trị liệt kê mặc định';
        break;
      case 'exclusiveMaximum':
        out = '';
        var cond = e.params.comparison + " " + e.params.limit;
        out += 'Nên là ' + (cond);
        break;
      case 'exclusiveMinimum':
        out = '';
        var cond = e.params.comparison + " " + e.params.limit;
        out += 'Nên là ' + (cond);
        break;
      case 'false schema':
        out = 'Lỗi mẫu Boolean';
        break;
      case 'format':
        out = 'Phải phù hợp với định dạng "' + (e.params.format) + '"';
        break;
      case 'formatExclusiveMaximum':
        out = 'formatExclusiveMaximum Phải là giá trị Boolean';
        break;
      case 'formatExclusiveMinimum':
        out = 'formatExclusiveMinimum Phải là giá trị Boolean';
        break;
      case 'formatMaximum':
        out = '';
        var cond = e.params.comparison + " " + e.params.limit;
        out += 'Nên là ' + (cond);
        break;
      case 'formatMinimum':
        out = '';
        var cond = e.params.comparison + " " + e.params.limit;
        out += 'Nên là ' + (cond);
        break;
      case 'if':
        out = 'nên phù hợp với mẫu "' + (e.params.failingKeyword) + '" ';
        break;
      case 'maximum':
        out = '';
        var cond = e.params.comparison + " " + e.params.limit;
        out += 'Nên là ' + (cond);
        break;
      case 'maxItems':
        out = '';
        var n = e.params.limit;
        out += 'Không nên có nhiều hơn ' + (n) + ' mục';
        break;
      case 'maxLength':
        out = '';
        var n = e.params.limit;
        out += 'Không được nhiều hơn ' + (n) + ' ký tự';
        break;
      case 'maxProperties':
        out = '';
        var n = e.params.limit;
        out += 'Không được có nhiều hơn ' + (n) + '  thuộc tính';
        break;
      case 'minimum':
        out = '';
        var cond = e.params.comparison + " " + e.params.limit;
        out += 'Nên là ' + (cond);
        break;
      case 'minItems':
        out = '';
        var n = e.params.limit;
        out += 'Không được ít hơn ' + (n) + ' mục';
        break;
      case 'minLength':
        out = '';
        var n = e.params.limit;
        out += 'Không được ít hơn ' + (n) + '  ký tự';
        break;
      case 'minProperties':
        out = '';
        var n = e.params.limit;
        out += 'Không được có ít hơn ' + (n) + ' thuộc tính';
        break;
      case 'multipleOf':
        out = 'Phải là bội số nguyên của ' + (e.params.multipleOf);
        break;
      case 'not':
        out = 'không nên phù hợp "not" schema';
        break;
      case 'oneOf':
        out = 'Chỉ có thể khớp với một trong "oneOf"';
        break;
      case 'pattern':
        out = 'nên phù hợp với mẫu "' + (e.params.pattern) + '"';
        break;
      case 'patternRequired':
        out = 'Cần có mẫu khớp thuộc tính ' + (e.params.missingPattern);
        break;
      case 'propertyNames':
        out = 'Tên thuộc tính không hợp lệ \'' + (e.params.propertyName);
        break;
      case 'required':
        out = 'Nên có thuộc tính bắt buộc ' + (e.params.missingProperty);
        break;
      case 'switch':
        out = 'không thông qua hiệu nghiệm  "switch" vì' + (e.params.caseIndex) + ' thất bại  ';
        break;
      case 'type':
        out = 'Nên thuộc loại ' + (e.params.type);
        break;
      case 'uniqueItems':
        out = 'Không được trùng lặp (mục (' + (e.params.j) + ') và (' + (e.params.i) + ') là trùng lặp)';
        break;
      default:
        continue;
    }
    e.message = out;
  }
};
