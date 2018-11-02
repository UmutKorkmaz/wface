import * as React from 'react';
import * as WFace from '@wface/components';

interface DemoScreenState {
  userData: any,
  lookup: any
}

export class DemoScreen extends React.Component<WFace.BaseScreenProps, DemoScreenState> {
  constructor(props) {
    super(props);

    this.state = this.props.screenData.state || {
      userData: {},
      lookup: [
        {label: 'Gaziantep', value: '27'},
        {label: 'İstanbul', value: '34'},
        {label: 'Şanlıurfa', value: '63'},
      ]
    }
  }

  tryGet = () => {
    this.props.httpService.get<RootObject>('https://reqres.in/api/users', { page: '2' })
      .then(response => {
        alert(response.page);
      })
      .catch(error => {

      })
      .finally(() => {

      });
  }

  public render() {
    return this.renderForm();
  }


  public renderHttpGet() {
    return (
      <React.Fragment>
        <WFace.WButton onClick={this.tryGet}>Req</WFace.WButton>
      </React.Fragment>
    )
  }

  public renderForm() {
    return (
      <div>
        <WFace.WForm
          initialValues={{
            checkbox: false,
            text: 'some text',
            date: new Date(1987, 3, 21),
            dateTime: new Date(),
            select: '34',
            selectMulti: ['27'],
            switch: true,
            time: new Date(),
          }}
          onSubmit={(val) => this.setState({ userData: val })}
        >
          <WFace.WGrid container>
            <WFace.WGrid item xs={6}>
              <WFace.WCard>
                <WFace.WCardHeader title="Kullanıcı Bilgileri" />
                <WFace.WCardContent>
                  <WFace.WFormField.Checkbox name="checkbox" label="Form Checkbox" />
                  <WFace.WFormField.TextField name="text" label="Form TextField" />
                  <WFace.WFormField.DatePicker name="date" label="Form Date" />
                  <WFace.WFormField.Select name="select" label="Form Select" options={this.state.lookup} />
                  <WFace.WFormField.Select name="selectMulti" label="Form Select Multi" options={this.state.lookup} isMulti/>
                  <WFace.WFormField.DateTimePicker name="dateTime" label="Form DateTime" />
                  <WFace.WFormField.TimePicker name="time" label="Form Time" />                
                  <WFace.WFormField.Switch name="switch" label="Form Switch" />
                </WFace.WCardContent>
                <WFace.WCardActions>
                  <WFace.WFormField.Submit>Gönder</WFace.WFormField.Submit>
                </WFace.WCardActions>
              </WFace.WCard>
            </WFace.WGrid>
            <WFace.WGrid item xs={6}>
              <WFace.WCard>
              <WFace.WCardHeader title="Kullanıcı Bilgileri" />
              <WFace.WCardContent>
                {JSON.stringify(this.state.userData, null, "\t")}
              </WFace.WCardContent>
              </WFace.WCard>
          </WFace.WGrid>
          </WFace.WGrid>                    
        </WFace.WForm>   
      </div >
    )
  }
}


export interface Datum {
  id: number;
  first_name: string;
  last_name: string;
  avatar: string;
}

export interface RootObject {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
  data: Datum[];
}
