// @flow
import React, {createElement} from 'react';
import classNames from 'classnames';

import FieldTypeBasic from './FieldTypeBasic';
import FieldTypeTextarea from './FieldTypeTextarea';
import ErrorBlock from './error-block';

const FieldTypes = {
  'text': FieldTypeBasic,
  'number': FieldTypeBasic,
  'email': FieldTypeBasic,
  'textarea': FieldTypeTextarea,
};

const resolveFieldType = (type) => FieldTypes[type] || FieldTypeBasic;

type Props = {
  className: String,
  disabled: Boolean,
  ErrorComponent: Function | Object,
  hint: String,
  input: Object,
  label: String,
  meta: Object,
  placeholder: String,
  required: Boolean,
  type: String,
}

const FormField = ({input, placeholder, type, label, meta, ErrorComponent, className, disabled, required, hint}: Props) => {
  const displayError = meta.error && meta.touched;
  const fieldComponent = resolveFieldType(type);

  return (
    <div className={classNames('form-field', className)}>
      {label && <label className="form-field__label" htmlFor={input.name}>{label}{required && ' *'}</label>}
      {hint && <span className="form-field__hint">{hint}</span>}
      {createElement(fieldComponent, {input, type, displayError, disabled, placeholder})}
      {displayError && <ErrorComponent {...meta}/>}
    </div>

  );
};

FormField.defaultProps = {
  disabled: false,
  ErrorComponent: ErrorBlock,
  required: true,
};

export default FormField;