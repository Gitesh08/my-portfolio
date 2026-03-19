import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollAnimate } from '../../../../shared/directives/scroll-animate';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { environment } from '../../../../../environments/environment';
// @ts-ignore
import * as flags from 'country-flag-icons/string/3x2';

@Component({
  selector: 'app-home-contact',
  standalone: true,
  imports: [CommonModule, ScrollAnimate, FormsModule],
  templateUrl: './home-contact.html',
  styleUrl: './home-contact.css'
})
export class HomeContact {
  formData = {
    name: '',
    email: '',
    phone: '',
    message: ''
  };

  countryCode = '+91';
  showDropdown = false;

  countryCodes: { code: string; dial: string; name: string; flag: SafeHtml }[] = [];

  private readonly DIAL_MAP: [string, string, string][] = [
    // South Asia
    ['IN', '+91',  'India'],
    ['PK', '+92',  'Pakistan'],
    ['BD', '+880', 'Bangladesh'],
    ['LK', '+94',  'Sri Lanka'],
    ['NP', '+977', 'Nepal'],
    ['BT', '+975', 'Bhutan'],
    ['MV', '+960', 'Maldives'],
    ['AF', '+93',  'Afghanistan'],
    // North America
    ['US', '+1',   'USA'],
    ['CA', '+1',   'Canada'],
    ['MX', '+52',  'Mexico'],
    ['PR', '+1',   'Puerto Rico'],
    // Europe
    ['GB', '+44',  'UK'],
    ['DE', '+49',  'Germany'],
    ['FR', '+33',  'France'],
    ['IT', '+39',  'Italy'],
    ['ES', '+34',  'Spain'],
    ['NL', '+31',  'Netherlands'],
    ['SE', '+46',  'Sweden'],
    ['NO', '+47',  'Norway'],
    ['DK', '+45',  'Denmark'],
    ['FI', '+358', 'Finland'],
    ['CH', '+41',  'Switzerland'],
    ['AT', '+43',  'Austria'],
    ['BE', '+32',  'Belgium'],
    ['PT', '+351', 'Portugal'],
    ['IE', '+353', 'Ireland'],
    ['PL', '+48',  'Poland'],
    ['RU', '+7',   'Russia'],
    ['UA', '+380', 'Ukraine'],
    ['GR', '+30',  'Greece'],
    ['CZ', '+420', 'Czech Republic'],
    ['HU', '+36',  'Hungary'],
    ['RO', '+40',  'Romania'],
    ['BG', '+359', 'Bulgaria'],
    ['HR', '+385', 'Croatia'],
    ['SK', '+421', 'Slovakia'],
    ['LT', '+370', 'Lithuania'],
    ['LV', '+371', 'Latvia'],
    ['EE', '+372', 'Estonia'],
    ['LU', '+352', 'Luxembourg'],
    ['MT', '+356', 'Malta'],
    ['IS', '+354', 'Iceland'],
    // Middle East
    ['AE', '+971', 'UAE'],
    ['SA', '+966', 'Saudi Arabia'],
    ['QA', '+974', 'Qatar'],
    ['KW', '+965', 'Kuwait'],
    ['BH', '+973', 'Bahrain'],
    ['OM', '+968', 'Oman'],
    ['IL', '+972', 'Israel'],
    ['TR', '+90',  'Turkey'],
    ['IR', '+98',  'Iran'],
    ['JO', '+962', 'Jordan'],
    ['LB', '+961', 'Lebanon'],
    ['IQ', '+964', 'Iraq'],
    // Asia Pacific
    ['CN', '+86',  'China'],
    ['JP', '+81',  'Japan'],
    ['KR', '+82',  'South Korea'],
    ['SG', '+65',  'Singapore'],
    ['ID', '+62',  'Indonesia'],
    ['MY', '+60',  'Malaysia'],
    ['TH', '+66',  'Thailand'],
    ['PH', '+63',  'Philippines'],
    ['VN', '+84',  'Vietnam'],
    ['HK', '+852', 'Hong Kong'],
    ['TW', '+886', 'Taiwan'],
    ['MO', '+853', 'Macau'],
    ['KH', '+855', 'Cambodia'],
    ['MM', '+95',  'Myanmar'],
    ['LA', '+856', 'Laos'],
    ['MN', '+976', 'Mongolia'],
    ['AU', '+61',  'Australia'],
    ['NZ', '+64',  'New Zealand'],
    ['FJ', '+679', 'Fiji'],
    ['PG', '+675', 'Papua New Guinea'],
    // Africa
    ['ZA', '+27',  'South Africa'],
    ['NG', '+234', 'Nigeria'],
    ['KE', '+254', 'Kenya'],
    ['GH', '+233', 'Ghana'],
    ['EG', '+20',  'Egypt'],
    ['ET', '+251', 'Ethiopia'],
    ['TZ', '+255', 'Tanzania'],
    ['MA', '+212', 'Morocco'],
    ['DZ', '+213', 'Algeria'],
    ['TN', '+216', 'Tunisia'],
    ['UG', '+256', 'Uganda'],
    ['CI', '+225', 'Ivory Coast'],
    ['SN', '+221', 'Senegal'],
    ['CM', '+237', 'Cameroon'],
    ['ZM', '+260', 'Zambia'],
    ['ZW', '+263', 'Zimbabwe'],
    ['BW', '+267', 'Botswana'],
    ['MU', '+230', 'Mauritius'],
    // Latin America
    ['BR', '+55',  'Brazil'],
    ['AR', '+54',  'Argentina'],
    ['CO', '+57',  'Colombia'],
    ['CL', '+56',  'Chile'],
    ['PE', '+51',  'Peru'],
    ['VE', '+58',  'Venezuela'],
    ['EC', '+593', 'Ecuador'],
    ['GT', '+502', 'Guatemala'],
    ['CU', '+53',  'Cuba'],
    ['BO', '+591', 'Bolivia'],
    ['DO', '+1-809', 'Dominican Rep.'],
    ['HN', '+504', 'Honduras'],
    ['PY', '+595', 'Paraguay'],
    ['SV', '+503', 'El Salvador'],
    ['NI', '+505', 'Nicaragua'],
    ['CR', '+506', 'Costa Rica'],
    ['PA', '+507', 'Panama'],
    ['UY', '+598', 'Uruguay'],
    ['JM', '+1-876', 'Jamaica'],
    ['TT', '+1-868', 'Trinidad & Tobago'],
  ];

  selectedCountry!: { code: string; dial: string; name: string; flag: SafeHtml };

  constructor(private http: HttpClient, private sanitizer: DomSanitizer) {
    this.countryCodes = this.DIAL_MAP.map(([code, dial, name]) => ({
      code, dial, name,
      flag: this.sanitizer.bypassSecurityTrustHtml((flags as Record<string, string>)[code] ?? '')
    }));
    this.selectedCountry = this.countryCodes[0];
    this.countryCode = this.selectedCountry.dial;
  }

  selectCountry(c: typeof this.countryCodes[0]) {
    this.selectedCountry = c;
    this.countryCode = c.dial;
    this.showDropdown = false;
  }

  isSubmitting = false;
  isSuccess = false;
  rateLimitError = '';
  private readonly RATE_LIMIT_MS = 2 * 60 * 1000; // 2 minutes
  resetForm(form: NgForm) {
    form.resetForm();
    this.formData = { name: '', email: '', phone: '', message: '' };
    this.selectedCountry = this.countryCodes[0];
    this.countryCode = this.selectedCountry.dial;
    this.showDropdown = false;
    this.rateLimitError = '';
  }

  onSubmit(form: NgForm) {
    if (form.invalid) return;

    // Check Rate Limiting First
    const lastSubmitTime = localStorage.getItem('lastContactSubmit');
    if (lastSubmitTime) {
      const timePassed = Date.now() - parseInt(lastSubmitTime, 10);
      if (timePassed < this.RATE_LIMIT_MS) {
        const secondsLeft = Math.ceil((this.RATE_LIMIT_MS - timePassed) / 1000);
        this.rateLimitError = `Please wait ${secondsLeft} seconds before sending another message.`;
        return;
      }
    }

    this.rateLimitError = '';
    this.isSubmitting = true;

    const fullPhone = this.formData.phone ? `${this.countryCode} ${this.formData.phone}` : 'Not provided';

    const payload = {
      access_key: environment.web3formsKey,
      name: this.formData.name,
      email: this.formData.email,
      phone: fullPhone,
      message: this.formData.message,
      subject: `New Portfolio Message from ${this.formData.name}`
    };

    this.http.post('https://api.web3forms.com/submit', payload).subscribe({
      next: (res) => {
        this.isSubmitting = false;
        this.isSuccess = true;

        // Store submission time
        localStorage.setItem('lastContactSubmit', Date.now().toString());
        
        // Use Angular's resetForm instead of just clearing the model
        // This clears validation errors and resets touched/dirty states
        form.resetForm();
        this.formData = { name: '', email: '', phone: '', message: '' }; 
        this.selectedCountry = this.countryCodes[0];
        this.countryCode = this.selectedCountry.dial;
        this.showDropdown = false;

        // Automatically hide the success message after 5 seconds
        setTimeout(() => {
          this.isSuccess = false;
        }, 5000);
      },
      error: (err) => {
        this.isSubmitting = false;
        this.rateLimitError = 'An error occurred while sending your message. Please try again.';
      }
    });
  }
}
